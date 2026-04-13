// astro.config.mjs
export default defineConfig({
  output: "hybrid",
  adapter: cloudflare({
    imageService: "passthrough",
    platformProxy: { enabled: true },
    session: false, // ← move it here, inside the adapter
  }),
  integrations: [tailwind()],
  // remove the top-level session block entirely
});
