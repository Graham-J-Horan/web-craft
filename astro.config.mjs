import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",
  // Replace with your actual Cloudflare Pages URL once you have it
  // site: "https://web-craft-v2.pages.dev", 
  integrations: [tailwind()],
  build: {
    format: 'directory'
  }
});
