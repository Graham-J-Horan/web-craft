import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",
  adapter: cloudflare({
    mode: 'directory',
    imageService: 'passthrough',
  }),
  integrations: [tailwind()],
});
