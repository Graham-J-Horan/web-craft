/**
 * session.ts
 * Typed session storage wrapper for the design brief.
 * Validates on read, expires after SESSION_TTL_MINUTES.
 * Import in both index.astro and finalise.astro scripts.
 */

const SESSION_KEY      = 'wc_design_brief_v2'; // bumped to avoid stale v1 data
const SESSION_TTL_MS   = 60 * 60 * 1000;       // 1 hour

export interface DesignBrief {
  trade:        string;
  businessName: string;
  location:     string;
  goal:         string;
  vibe:         string;
  usp:          string;
  savedAt:      number; // Date.now()
}

/** Save the brief to sessionStorage */
export function saveBrief(brief: Omit<DesignBrief, 'savedAt'>): void {
  const payload: DesignBrief = { ...brief, savedAt: Date.now() };
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage may be unavailable in private mode — fail silently
  }
}

/** Read and validate the brief. Returns null if missing, malformed, or expired. */
export function loadBrief(): DesignBrief | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<DesignBrief>;

    // Expiry check
    if (!parsed.savedAt || Date.now() - parsed.savedAt > SESSION_TTL_MS) {
      clearBrief();
      return null;
    }

    // Required field check
    if (!parsed.trade || !parsed.businessName || !parsed.goal || !parsed.vibe) {
      clearBrief();
      return null;
    }

    return parsed as DesignBrief;
  } catch {
    return null;
  }
}

/** Remove the brief from sessionStorage */
export function clearBrief(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch { /* */ }
}
