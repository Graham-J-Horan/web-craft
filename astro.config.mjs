import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// Force fresh build
export default defineConfig({
  output: "static",
  site: "https://web-craft.pages.dev", 
  base: "/", 
  integrations: [tailwind()],
  build: {
    format: 'directory'
  },
  trailingSlash: 'ignore'
});