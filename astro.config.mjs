// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// NOTE: update `site` to the real production domain before deploying —
// it drives canonical URLs, Open Graph URLs and the sitemap.
// The site is static apart from the on-demand `/api/register` endpoint, which
// runs as a Cloudflare function (the adapter handles that single route).
export default defineConfig({
  site: 'https://home2u.com',
  output: 'static',
  adapter: cloudflare(),
  integrations: [sitemap()],
  // The form endpoint doesn't use Astro Sessions; use the in-memory driver so the
  // Cloudflare adapter doesn't require a KV namespace ("SESSION") to be provisioned.
  session: {
    driver: 'memory',
  },
});
