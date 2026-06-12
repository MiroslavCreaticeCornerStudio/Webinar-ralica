# IMAGE MANIFEST

All assets live in `public/assets/images/`. Figma asset URLs expire after 7 days — re-run `/build` or re-export if any need refreshing. Large raster exports were downscaled/recompressed (total folder ~2.8MB, down from ~18MB).

## Photos (raster)
| File | Dimensions | Status | Notes |
|------|-----------|--------|-------|
| `hero-speaker-ralitsa.png` | ~933×1400 | ✅ | Hero speaker cutout (transparent). Downscaled from 2667×4000 (9.7MB → 1.2MB) |
| `speaker-panel.png` | 626×602 | ✅ recovered | Composited speaker panel (photo + gradient + grid). **Original raster fill exported blank (2.8KB)** — recovered via `get_screenshot` of node `2287:480` |
| `hero-bg-cityscape.jpg` | 1600w | ✅ | Hero background, used at 8% opacity. PNG→JPEG (3.1MB → 404KB) |
| `cta-bg-cityscape.jpg` | 1600w | ✅ | CTA band background. PNG→JPEG (2.2MB → 316KB) |
| `final-cta-bg.jpg` | 1600w | ✅ | Final CTA background. PNG→JPEG (2.2MB → 316KB) |

## Logo & icons (SVG, crimson fills via Figma fallback)
| File | Used in |
|------|---------|
| `logo-home2u-icon.svg`, `logo-home2u-text.svg` | Header + Footer |
| `icon-calendar.svg`, `icon-clock.svg`, `icon-map-pin.svg`, `icon-hourglass.svg` | Hero event cards + Final CTA details (reused) |
| `who-icon-1-chartlineup` … `who-icon-5-listchecks.svg` | Who-is-it-for (5) |
| `who-decorative-ellipses.svg` | Who-is-it-for background decoration |
| `learn-icon-1-checks` … `learn-icon-6-chartbar.svg` | What-You-Learn (6) |
| `benefit-icon-1-usercirclegear` … `benefit-icon-4-handshake.svg` | Benefits (4) |
| `footer-icon-phone.svg`, `footer-icon-email.svg` | Footer contacts |

## Failed / recovered downloads
- **`speaker-panel`** — the Figma raster fill for "Speaker Image" (`2352:527`) exported as a blank 2.8KB PNG. Resolved by rasterizing the parent container via `get_screenshot`. If you have the original headshot, drop it in and update `src/components/Speaker.astro`.
