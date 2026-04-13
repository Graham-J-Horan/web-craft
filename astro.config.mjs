import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough", // Start with passthrough for images
  }),
  integrations: [tailwind()],
});
