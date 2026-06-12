// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// NOTE: update `site` to the real production domain before deploying —
// it drives canonical URLs, Open Graph URLs and the sitemap.
export default defineConfig({
  site: 'https://home2u.com',
  integrations: [sitemap()],
  adapter: cloudflare(),
});