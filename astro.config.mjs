import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static", // Hybrid-by-default in Astro 6
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  integrations: [tailwind()],
});
