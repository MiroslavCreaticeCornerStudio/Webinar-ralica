# PROJECT BRIEF — Home2U Webinar Landing Page

Auto-generated from the Figma design (`zC2fj9ygaCKgnemwpd4Bln`, frame `2287:279` "Homepage").

## Project
- **Name:** Сделки за милиони — безплатен уебинар с Ралица Ценова (Home2U)
- **Type:** Single-page webinar registration landing page
- **Language:** Bulgarian (`bg`)
- **Framework:** Astro 6 (static), no CSS framework — design tokens + scoped component styles
- **Design frame width:** 1440px → `--size-container-ideal: 1440`, `--size-container-max: 1440px`

## Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#A90831` | brand crimson — accents, CTAs, icons, highlights |
| `--color-primary-dark` | `#880425` | gradient start on filled CTAs |
| `--color-heading` / `--color-text-primary` | `#1C1C1C` | headlines |
| `--color-text-secondary` | `#4F4F4F` | body copy |
| `--color-bg-light` | `#F4F4F4` | event-info cards |
| neutrals | `#FFFFFF`, `#909090` (placeholder), `#C6C6C6` (footer rule), `#E0E0E0` (dividers) | |

Gradients: hero `linear-gradient(129deg, rgba(165,196,214,.8), rgba(252,235,236,.8))`; CTA button `linear-gradient(270deg, #880425, #A90931)`; section overlays blue→pink at 0.7–0.85 alpha.

## Typography
- Design font: **Sharp Grotesk Cyr** — Book (400) + Medium (500). Commercial typeface → **substituted with Inter** (full Cyrillic, neutral grotesque), loaded from Google Fonts (weights 400/500/600/700, cyrillic+latin subsets).
- To restore brand type: drop licensed Sharp Grotesk `woff2` files in `/public/assets/fonts`, add `@font-face`, and update `--font-heading` / `--font-body` in `src/styles/global.css`.
- Heading sizes used: H1 52px, section titles 42px, learning titles 24px, benefit titles 22px, body 16–18px.
- `line-height` unitless; `letter-spacing` in px.

## Spacing & radius
- Section vertical padding 80–84px; container inset 80px (`--container-padding: 5em`, → 1.5em tablet, 1em mobile).
- Radii: cards 12px, glass panels 30px, pills 33–40px, inputs 24px.

## Components → Figma nodes
See `SITE_MAP.md` for the full section → nodeId map.

## Special interactions
- **Live countdown** to `2026-06-18T18:00+03:00` (hero + final CTA) — vanilla JS, the only scripted behavior beyond the mobile menu and form validation.
- **Mobile hamburger menu** at ≤991px.
- **Registration form** (name / phone / email + consent) with client-side validation — needs a backend/form-service connection (see component TODO).
