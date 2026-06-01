import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.toileblanche.com',
  integrations: [
    sitemap({
      /** /seminaire is noindex (microsite on leseminaire.*); omit from www sitemap */
      filter: (page) => !page.includes('/seminaire'),
    }),
  ],
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
});
