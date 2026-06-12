# SITE_MAP — Home2U Webinar ("Сделки за милиони")

**fileKey:** `zC2fj9ygaCKgnemwpd4Bln`
**Top-level frame:** `2287:279` — "Homepage" (1440 × 5223)
**Language:** Bulgarian (bg)
**Framework:** Astro (static)

## Sections (build order, top → bottom)

| # | Section | nodeId | Component | Notes |
|---|---------|--------|-----------|-------|
| 1 | Hero (incl. navbar) | `2287:285` | `Hero.astro` + `Header.astro` | Gradient bg + cityscape, tagline, H1 (52px), subtext, primary CTA, **countdown**, speaker photo + 2 floating badges, 4 event-info cards |
| 2 | Who is it for | `2287:370` | `WhoIsItFor.astro` | Section title + decorative ellipses, 5 info rows (icon + text) |
| 3 | CTA band | `2287:413` | `CtaBand.astro` | Mid-page call-to-action band |
| 4 | What You'll Learn | `2287:420` | `WhatYouLearn.astro` | Header + 2×3 grid of learning blocks (icon + title + desc + underline) |
| 5 | Speaker | `2287:477` | `Speaker.astro` | Speaker photo + tagline + name/role + 3 bullet points |
| 6 | Benefits | `2287:678` | `Benefits.astro` | 4 benefit columns with icons + dividers |
| 7 | Final CTA | `2287:526` | `FinalCta.astro` | Gradient bg, webinar header, details, **countdown**, contact form (name/phone/email + consent) |
| 8 | Footer | `2287:590` | `Footer.astro` | Logo + description, quick links, contact links, bottom legal bar |

## Design tokens (from Figma)
- Accent/brand `#A90831`, gradient-cta `#880425 → #A90931`
- Heading `#1C1C1C`, body `#4F4F4F`, card bg `#F4F4F4`, white `#FFFFFF`
- Hero gradient `linear-gradient(129deg, rgba(165,196,214,.8) 12.5%, rgba(252,235,236,.8) 64.9%)`
- Type: Sharp Grotesk Cyr (Book 400 / Medium 500) → substituted with **Inter** (Cyrillic)
- Frame width 1440 → `--size-container-ideal: 1440`, `--size-container-max: 1440px`

## Reusable patterns
- **Section header**: short accent line (40px) + title, `#A90831` highlight on key words
- **Pill badges**: rounded `40px`, white/glass bg, `#A90831` border + text
- **Cards**: `#F4F4F4` bg, radius 12px
- **CTA button**: gradient pill, white text, soft crimson shadow
