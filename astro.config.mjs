import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",
  adapter: cloudflare({
    imageService: "passthrough",
  }),
  integrations: [tailwind()],
});
