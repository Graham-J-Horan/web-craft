# Design System Document: The Kinetic Intelligence Framework
 
## 1. Overview & Creative North Star: "WebCraft"
This design system moves away from the static, "boxy" nature of traditional web builders. Our North Star, **WebCraft**, views the UI as a fluid, living laboratory where AI-generated content isn't just displayed—it is "manifested."
 
To break the "template" look, we utilize **Intentional Asymmetry** and **Tonal Depth**. Instead of standard grids, we use overlapping containers and exaggerated typographic scales to create a high-end editorial feel. This system prioritizes speed and clarity through ample whitespace, ensuring the high-tech aesthetic never feels cluttered.
 
---
 
## 2. Colors & Surface Philosophy
The palette is rooted in deep space blacks and forest greens, punctuated by "Emerald Green" and "Neon Mint" accents that signify the pulse of the AI.
 
### Surface Hierarchy & Nesting
We reject the flat UI. We treat the interface as a series of physical layers.
- **Layer 0 (Base):** `surface` (#0c0e17) – The infinite void.
- **Layer 1 (Sections):** `surface_container_low` (#11131d) – To define large content areas.
- **Layer 2 (Cards):** `surface_container` (#171924) – For interactive modules.
- **Layer 3 (Floating):** `surface_container_highest` (#222532) – For active states or popovers.
 
### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off content. Boundaries must be defined solely through background color shifts. A `surface_container_low` card sitting on a `surface` background provides all the definition needed. 
 
### The "Glass & Gradient" Rule
To signify innovation, use Glassmorphism for floating elements (e.g., navigation bars or floating action buttons). Use `surface_bright` at 60% opacity with a `24px` backdrop-blur. 
- **Signature Texture:** Primary CTAs should use a linear gradient from `primary` (#10b981) to `primary_dim` (#059669) at a 135-degree angle to provide "visual soul."
 
---
 
## 3. Typography: The Editorial Edge
We pair the technical precision of **Space Grotesk** with the human-centric clarity of **Manrope**.
 
*   **Display & Headlines (Space Grotesk):** Use `display-lg` (3.5rem) for hero statements. The wide apertures and geometric shapes of Space Grotesk communicate high-tech sophistication.
*   **Body & Titles (Manrope):** Use `body-lg` (1rem) for descriptions. Manrope’s modern sans-serif builds trust and ensures legibility during the AI generation process.
*   **The Contrast Rule:** Always pair a `display-sm` headline with `label-md` uppercase sub-headlines to create an authoritative, magazine-like hierarchy.
 
---
 
## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "heavy" for a high-speed AI generator. We use **Ambient Glows** and **Tonal Stacking**.
 
*   **The Layering Principle:** Depth is achieved by stacking. A `surface_container_lowest` (#000000) card placed on a `surface_container_low` (#11131d) creates a "recessed" look, while a `surface_container_high` (#1c1f2b) creates a "lift."
*   **Ambient Shadows:** If a floating effect is required, use a shadow with a 40px blur, 0% spread, and 8% opacity, tinted with `primary` (#10b981). It should look like a soft glow, not a dark shadow.
*   **The Ghost Border:** If accessibility requires a stroke, use `outline_variant` (#464752) at 15% opacity. Never use 100% opaque borders.
 
---
 
## 5. Components
 
### Buttons
- **Primary:** Gradient (`primary` to `primary_dim`), `xl` roundedness (0.75rem). On hover, add a subtle outer glow using `primary_fixed_dim`.
- **Secondary:** Surface-only with a "Ghost Border." Text color uses `primary`.
- **Tertiary:** Text-only in `label-md`, using `tertiary` (#6ee7b7) for "New" or "AI" features.
 
### Input Fields
- **Default State:** `surface_container_highest` background, no border.
- **Focus State:** Subtle `primary` glow (2px soft blur) and the text transitions to `on_surface`.
- **For AI Prompts:** Use a larger `xl` roundedness and a `secondary_container` (#064e3b) subtle background tint to differentiate the "Creative Input" from standard forms.
 
### Cards & Lists
- **No Dividers:** Forbid the use of horizontal lines. Separate list items using `12px` of vertical whitespace or a subtle toggle between `surface_container_low` and `surface_container`.
- **The "Pulse" Chip:** For AI status indicators (e.g., "Generating..."), use a chip with `secondary_container` background and `secondary` text, featuring a soft breathing animation.
 
### Specialized AI Components
- **The "Generation Beam":** A 2px height progress bar using a gradient of `tertiary` to `secondary`.
- **The Magic Wand FAB:** A floating action button using Glassmorphism and a `primary` icon, used to trigger AI refinements.
 
---
 
## 6. Do's and Don'ts
 
### Do
*   **Do** use intentional asymmetry. Shift a text block 40px to the left of its container to create a "custom-coded" look.
*   **Do** use `tertiary` (#6ee7b7) sparingly for "AI Insights"—it should feel like a rare, valuable spark.
*   **Do** leverage `0.75rem` (xl) corner radius for large containers to soften the "tech" feel and make it approachable.
 
### Don't
*   **Don't** use pure white (#FFFFFF) for body text; use `on_surface` (#f0f0fd) to reduce eye strain in dark mode.
*   **Don't** use standard 1px borders or dividers. They clutter the UI and break the "WebCraft" illusion.
*   **Don't** use traditional "heavy" shadows. If the element doesn't feel like it's emitting light, it doesn't belong in this system.