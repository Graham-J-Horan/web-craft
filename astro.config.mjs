import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",
  adapter: cloudflare({
    imageService: "passthrough",
    platformProxy: { enabled: true },
    prerenderEnvironment: "node",
    session: false, // ← move it here, inside the adapter
  }),
  integrations: [tailwind()],
  // remove the top-level session block entirely
});
