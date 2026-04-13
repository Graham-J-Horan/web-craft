# WebCraft AI — Your Website, Designed by AI. Built by Us.

An interactive website showcase where full-screen website mockups act as the canvas,
and clickable hotspot dots let visitors explore and configure each element before purchasing.

## Stack

- **Astro** — static site generator (zero JS by default, opt-in islands)
- **Biome** — linter + formatter (replaces ESLint + Prettier)
- **Tailwind** — utility CSS (optional, global CSS vars used in prototype)
- **Stripe** — payment (hook up in `/src/pages/cart.astro`)
- **localStorage** — cart & config state (V1; swap for DB in V2)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:4321

## Project Structure

```
src/
├── data/
│   └── templates.ts        ← All template definitions, hotspot data, config options
├── components/
│   ├── HotspotCanvas.astro ← Dot layer + popup interaction logic
│   ├── MockSite.astro      ← CSS/HTML mock website screenshots (per industry)
│   ├── TemplateCard.astro  ← Card component for the storefront grid
│   └── IndustryNav.astro   ← Sticky filter bar (plumber, solicitor, etc.)
├── layouts/
│   └── Layout.astro        ← Global HTML shell, fonts, CSS vars
└── pages/
    ├── index.astro          ← Storefront / browse page
    ├── cart.astro           ← Cart + order summary
    └── configure/
        └── [id].astro       ← Per-template configuration page
```

## Adding a New Industry Template

1. Open `src/data/templates.ts`
2. Add a new entry to the `templates` array:

```ts
{
  id: 'dentist',
  industry: 'Dentist',
  tagline: 'Smiles that last a lifetime',
  screenshot: 'dentist',   // add matching key in MockSite.astro
  accentColor: '#0ea5e9',
  price: 329,
  hotspots: [
    {
      id: 'dentist-hero',
      x: 20,   // percentage from left
      y: 25,   // percentage from top
      label: 'Practice Name',
      description: 'Your practice name and tagline at the top of the page.',
      configOptions: [
        { id: 'name', label: 'Practice name', type: 'text', value: 'Bright Smiles Dental' },
        { id: 'accent', label: 'Brand colour', type: 'color', value: '#0ea5e9' },
      ],
    },
    // ... more hotspots
  ],
},
```

3. Add the matching visual config in `MockSite.astro` under `configs` and `industryContent`.

That's it — the route, card, canvas, and configure page are all generated automatically.

## Dot Positioning Tips

Dots use **percentage-based** x/y coordinates so they scale with the canvas:
- `x: 50, y: 50` = dead centre
- `x: 10, y: 8` = top-left area (good for nav/logo dots)
- `x: 75, y: 65` = lower right (good for feature/service dots)

The popup auto-flips below the dot if the dot is in the top 30% of the canvas,
and nudges left/right if near the edges — no manual adjustment needed.

## Connecting Stripe

In `src/pages/cart.astro`, replace the `btn-checkout` click handler with:

```js
const res = await fetch('/api/checkout', {
  method: 'POST',
  body: JSON.stringify({ cart }),
  headers: { 'Content-Type': 'application/json' },
});
const { url } = await res.json();
window.location.href = url;
```

Then add `src/pages/api/checkout.ts` as an Astro API endpoint that creates a
Stripe Checkout Session and returns the URL. Switch `output: 'server'` in
`astro.config.mjs` when adding API routes.

## Replacing Mock Screenshots with Real Images

Swap `MockSite.astro` usage with a simple `<img>` tag:

```astro
<!-- In TemplateCard.astro and configure/[id].astro -->
<img
  src={`/screenshots/${template.id}.webp`}
  alt={`${template.industry} website preview`}
  class="w-full h-full object-cover object-top"
/>
```

Put your screenshot `.webp` files in `public/screenshots/`. Recommended size: **1440×900px**.
Capture them with Puppeteer/Playwright at that viewport for consistency.
