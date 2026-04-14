import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",
  site: "https://web-craft.pages.dev", // Replace with your actual Pages URL
  base: "/",
  integrations: [tailwind()],
  build: {
    format: 'directory'
  },
  trailingSlash: 'ignore'
});
