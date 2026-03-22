import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://www.toileblanche.com',
  integrations: [sitemap()],

  vite: {
    build: {
      target: 'esnext',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  output: "hybrid",
  adapter: cloudflare()
});