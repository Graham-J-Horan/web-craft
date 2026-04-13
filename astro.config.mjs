import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',

  // Uncomment to add Tailwind:
  // integrations: [tailwind()],
  adapter: node({ mode: 'standalone' }),

  integrations: [tailwind()],
});