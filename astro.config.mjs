import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    mode: "advanced", // This creates the _worker.js file Cloudflare needs
    imageService: "passthrough", // Avoid sharp issues on Cloudflare
  }),
  integrations: [tailwind()],
});
