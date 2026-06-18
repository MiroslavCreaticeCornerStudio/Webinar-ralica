// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// NOTE: update `site` to the real production domain before deploying —
// it drives canonical URLs, Open Graph URLs and the sitemap.
// The site is static apart from the on-demand `/api/register` endpoint, which
// runs as a Vercel serverless function (the adapter handles that single route).
export default defineConfig({
  site: 'https://home2u.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
});
