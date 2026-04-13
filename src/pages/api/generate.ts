import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GenerateRequest {
  trade: string;
  businessName: string;
  location?: string;
  goal: string;
  vibe: string;
  usp?: string;
}

// ─── Static lookup maps ───────────────────────────────────────────────────────

const vibeMap: Record<
  string,
  { palette: string; typography: string; mood: string }
> = {
  'dark-bold': {
    palette:
      'very dark charcoal (#0c0e17) background, vibrant emerald green (#10b981) accent, pure white text',
    typography:
      'heavy weight sans-serif headlines, tight letter-spacing, large font sizes',
    mood: 'powerful, confident, high-contrast, premium dark theme',
  },
  'clean-minimal': {
    palette:
      'pure white background, light grey sections (#f8fafc), muted forest-green accent, dark charcoal text',
    typography:
      'light weight sans-serif, generous whitespace, refined and airy',
    mood: 'minimal, Scandinavian, breathable, modern',
  },
  'warm-friendly': {
    palette:
      'warm off-white (#fdf8f3) background, terracotta/amber accent (#d97706), dark warm brown text',
    typography:
      'approachable rounded sans-serif, medium weight, comfortable reading size',
    mood: 'welcoming, trustworthy, local, community-focused',
  },
  'luxury-premium': {
    palette:
      'deep black (#0a0a0a) background, gold/champagne accent (#d4a843), cream text (#faf8f5)',
    typography:
      'elegant serif display font, light body weight, sophisticated spacing',
    mood: 'luxury, premium, exclusive, refined, editorial',
  },
};

const tradeHints: Record<string, string> = {
  plumber:
    'Layout: High-urgency split hero. Prominent "Emergency Callout" badge, visible 5-star Google review count, Gas Safe / Checkatrade trust badges in header. Service grid: boiler repair, burst pipes, leak detection.',
  electrician:
    'Layout: Technical and trusted. NICEIC certification prominently displayed. "Free Safety Inspection" highlight. Service cards for rewiring, fuse boards, and smart home installation.',
  solicitor:
    'Layout: Authoritative and traditional. Serif headlines. Areas of practice cards (family, conveyancing, probate). Testimonial slider. "Book Consultation" footer CTA.',
  accountant:
    'Layout: Clean and data-driven. Infographic-style service icons (tax, payroll, VAT). Client portal login in nav. "Switch to Us" value proposition highlighted.',
  photographer:
    'Layout: Immersive portfolio. Full-bleed background image with minimal overlay. Subtle navigation. Masonry grid for recent projects. "Check Availability" floating CTA.',
  'personal trainer':
    'Layout: High-energy and motivational. Split hero with transformation story. Pricing table for program tiers. Instagram feed integration in footer.',
  artist:
    'Layout: Minimalist editorial. Large whitespace. "Exhibitions" timeline. Shop integration with high-res product cards. Artist statement prominently placed.',
  restaurant:
    'Layout: Visual and sensory. Floating "Book a Table" button. Menu highlights with price tags. OpenTable integration look. Vibrant food photography.',
  dentist:
    'Layout: Clinical but approachable. "Meet the Team" circular portraits. Service icons for cosmetic, implants, and general. "Join Our Practice" primary CTA.',
  architect:
    'Layout: Sophisticated and geometric. Technical drawings as subtle background elements. "Projects" filterable grid. High-end material descriptions.',
};

const goalMap: Record<
  string,
  { cta: string; headlineFocus: string; trustBadge: string }
> = {
  emergency: {
    cta: 'Call Now for Emergency Service',
    headlineFocus: 'Fast response, emergency repairs',
    trustBadge: '24/7 Emergency | Same-Day Service',
  },
  bookings: {
    cta: 'Book Online Now',
    headlineFocus: 'Easy online booking, instant confirmation',
    trustBadge: 'Free Quote | Secure Booking',
  },
  showcase: {
    cta: 'View Our Work',
    headlineFocus: 'See our latest projects and portfolio',
    trustBadge: 'Award Winning | 5-Star Rated',
  },
  leads: {
    cta: 'Get a Free Quote',
    headlineFocus: 'Contact us for a personalised consultation',
    trustBadge: 'Free Estimate | No Obligation',
  },
};

// ─── Input sanitisation ───────────────────────────────────────────────────────

function sanitise(str: string, maxLen = 120): string {
  return str
    .trim()
    .replace(/[<>"'`]/g, '')
    .slice(0, maxLen);
}

// ─── Call Your Cloudflare Worker ─────────────────────────────────────────────

async function generateWithCloudflareWorker(
  prompt: string,
  workerUrl: string,
): Promise<string> {
  // Try GET request with prompt as query parameter
  const url = new URL(workerUrl);
  url.searchParams.set('prompt', prompt);

  const response = await fetch(url.toString(), {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(
      `Worker error (${response.status}): ${await response.text()}`,
    );
  }

  const imageBuffer = await response.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString('base64');
  return `data:image/png;base64,${base64Image}`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export const POST: APIRoute = async ({ request }) => {
  // ── 1. Parse & validate input ──────────────────────────────────────────────

  let body: Partial<GenerateRequest>;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const { trade, businessName, location, vibe, goal, usp } = body;

  if (!trade || !businessName || !vibe || !goal) {
    return errorResponse(
      'Missing required fields: trade, businessName, vibe, goal',
      400,
    );
  }

  // Validate enum fields
  if (!vibeMap[vibe]) {
    return errorResponse(`Invalid vibe value: "${vibe}"`, 400);
  }
  if (!goalMap[goal]) {
    return errorResponse(`Invalid goal value: "${goal}"`, 400);
  }

  // Sanitise all string inputs
  const safeTrade = sanitise(trade, 60);
  const safeBusinessName = sanitise(businessName, 60);
  const safeLocation = sanitise(location ?? 'UK', 60);
  const safeUsp = sanitise(usp ?? '', 120);

  // ── 2. Validate environment variables ──────────────────────────────────────

  const geminiApiKey = import.meta.env.GEMINI_API_KEY;
  const cloudflareWorkerUrl = import.meta.env.CLOUDFLARE_WORKER_URL;

  if (!geminiApiKey) {
    return errorResponse('GEMINI_API_KEY is not configured', 500);
  }
  if (!cloudflareWorkerUrl) {
    return errorResponse('CLOUDFLARE_WORKER_URL is not configured', 500);
  }

  // ── 3. Build strategic context ─────────────────────────────────────────────

  const vibeConfig = vibeMap[vibe];
  const goalStrategy = goalMap[goal];
  const tradeKey = safeTrade.toLowerCase().replace(/\s+/g, ' ');
  const tradeContent =
    tradeHints[tradeKey] ??
    tradeHints.plumber ??
    'hero section, services grid, testimonials, contact CTA';
  const locationText =
    safeLocation && safeLocation !== 'UK' ? ` in ${safeLocation}` : '';
  const uspLine = safeUsp ? `"${safeUsp}"` : 'quality service you can trust';

  // ── 4. Gemini: craft the image-gen prompt ──────────────────────────────────

  let imagePrompt: string;

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite-preview',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    const systemPrompt = `You are a senior UI/UX designer and conversion specialist.
Generate a single dense prompt for a high-fidelity WEBSITE HOMEPAGE MOCKUP with these specs:

BUSINESS CONTEXT:
- Brand Name: "${safeBusinessName}"
- Trade: "${safeTrade}"
- Location: "${safeLocation}"
- Competitive Edge: ${uspLine}

VISUAL STYLE & STRATEGY:
- Design Vibe: ${vibeConfig.mood}
- Primary Palette: ${vibeConfig.palette}
- Font Strategy: ${vibeConfig.typography}
- Conversion Goal: ${goalStrategy.headlineFocus}

UX ARCHITECTURE:
- Industry-Specific Layout: ${tradeContent}
- Required Elements: Navigation bar with Logo, Hero Section, 3 Benefit Cards, CTA Section.

STRICT DESIGN RULES:
1. START the prompt with: "A high-fidelity website homepage mockup, professional UI design, pixel-perfect layout,"
2. INCLUDE "${safeBusinessName}" as the prominent logo in the navbar.
3. CRAFT A COMPELLING HERO COPY: Write a hook-driven headline and a benefit-led subheadline that mentions ${safeLocation}. Use these strings in the mockup.
4. UI FINESSE: Use the specified palette. Ensure clean vertical rhythm, ample whitespace, and high-end aesthetics.
5. NEGATIVE CONSTRAINTS: No browser chrome (no address bars, tabs, or desktop windows). No generic placeholder text (use trade-specific benefits). No watermarks. No stock photo distortions. No "boxy" 2010-era design.
6. OUTPUT ONLY the refined image generation prompt. No preamble.`;

    const result = await model.generateContent(systemPrompt);
    imagePrompt = result.response.text().trim();

    if (!imagePrompt) throw new Error('Gemini returned an empty prompt');
  } catch (err) {
    console.error('[generate] Gemini error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown Gemini error';
    return errorResponse(`Design brief generation failed: ${msg}`, 502);
  }

  // ── 5. Generate image with your Cloudflare Worker ──────────────────────────

  let imageUrl: string;

  try {
    imageUrl = await generateWithCloudflareWorker(
      imagePrompt,
      cloudflareWorkerUrl,
    );
  } catch (err) {
    console.error('[generate] Cloudflare Worker error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return errorResponse(`Image generation failed: ${msg}`, 502);
  }

  // ── 6. Return success ──────────────────────────────────────────────────────

  return new Response(
    JSON.stringify({
      success: true,
      imageUrl,
      imagePrompt,
      meta: {
        trade: safeTrade,
        businessName: safeBusinessName,
        location: safeLocation,
        goal,
        vibe,
        vibeLabel: vibeConfig.mood,
        provider: 'cloudflare-worker',
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
