// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://preeminent-pastelito-8d7f42.netlify.app',
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react()
  ],

  adapter: netlify()
});