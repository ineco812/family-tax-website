// @ts-check
import { defineConfig } from 'astro/config';

process.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG = 'keystatic';
process.env.PUBLIC_KEYSTATIC_URL = 'https://preeminent-pastelito-8d7f42.netlify.app';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://preeminent-pastelito-8d7f42.netlify.app',
  output: 'static',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    keystatic()
  ],

  adapter: netlify()
});