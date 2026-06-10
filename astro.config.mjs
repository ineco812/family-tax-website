// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import remarkHtmlBlocks from './src/lib/remark-html-blocks.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://family-lawcare.kr',
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  },

  markdown: {
    remarkPlugins: [remarkHtmlBlocks]
  },

  integrations: [
    react(),
    sitemap(),
    robotsTxt()
  ],

  adapter: netlify()
});