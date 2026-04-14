import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",
  site: "https://web-craft.pages.dev", 
  base: "./", 
  integrations: [tailwind()],
  build: {
    format: 'directory'
  },
  trailingSlash: 'ignore'
});
