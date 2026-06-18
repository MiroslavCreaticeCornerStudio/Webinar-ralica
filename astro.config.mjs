// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// `site` is the production domain — it drives canonical URLs, Open Graph URLs
// and the sitemap. The campaign landing page lives at /deals-worth-millions;
// the bare domain root permanently (301) redirects there.
// The site is static apart from the on-demand `/api/register` endpoint, which
// runs as a Vercel serverless function (the adapter handles that single route).
export default defineConfig({
  site: 'https://webinar.home2u.bg',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  redirects: {
    '/': { status: 301, destination: '/deals-worth-millions' },
  },
});
