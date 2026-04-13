import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static", // Hybrid-by-default in Astro 6
  adapter: cloudflare({
    imageService: 'passthrough',
    // Fixes the "Failed to get static paths" error in Astro 6 + Cloudflare
    prerenderEnvironment: 'node',
  }),
  integrations: [tailwind()],
});
