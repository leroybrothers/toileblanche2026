# Toile Blanche — Brand System

Quick reference for designers and developers. The canonical implementation lives in **tokens** — always use `var()` references in code.

---

## Implementation

| Resource | Path |
|----------|------|
| Design tokens (CSS variables) | [`public/css/tokens.css`](../public/css/tokens.css) |

All brand colours, typography, spacing, and interaction values are defined there. Use tokens in CSS; avoid hardcoded hex, font names, or pixel values.

---

## Palette

| Token | Hex | Use |
|-------|-----|-----|
| **Ink** | `#2c2a26` | Body copy, UI elements |
| **Ink deep** | `#1C1917` | Headings, maximum emphasis |
| **Terracotta** | `#9e5c4a` | CTAs, links, highlights |
| **Stone** | `#6B6256` | Secondary text, labels, captions |
| **Sage** | `#4a7c59` | Success, subtle accent |
| **Canvas** | `#FAF8F3` | Site background |
| **Bg warm** | `#f5f2ed` | Cards, menu, section backgrounds |
| **Border** | `#E2D9CC` | Rules, dividers |

Opacity variants (`--color-ink-06`, `--color-white-60`, etc.) exist for overlays and subtle states.

---

## Typography

| Token | Font | Role |
|-------|------|------|
| `--font-display` | Gilda Display | Headlines, hero, suite names |
| `--font-editorial` | Cormorant Garamond | Pull quotes, captions, italic subheads |
| `--font-body` | Didact Gothic | Body copy, UI, navigation, forms |

Load weights as used: Gilda 400; Cormorant 400i, 500i, 600i; Didact 400.

---

## Logo

Two variants only:

| Context | File | Format |
|---------|------|--------|
| On dark / hero / image | `Toile Blanche Logo 2022 light.webp` | WebP |
| On light / scroll / footer | `Toile Blanche Logo 2022 black.avif` | AVIF |

- Nav dark (hero): light logo  
- Nav light (scrolled): black logo  
- Footer: black logo  
- Page loader: black logo  

Paths: `/assets/images/` (see `Nav.astro`, `Footer.astro`).

---

## Imagery

- **Suites:** Card images in `/assets/images/{suite-slug}/`; gallery and hero use `-600w`, `-1200w` srcsets.
- **Photography:** Warm, natural light; avoid high contrast or heavy filters. People, art, and architecture are primary subjects.
- **Affiliations:** Michelin Key and SLH logos live in `/assets/images/affiliations/` and appear in the menu.

---

## Spacing & Scale

Spacing uses an 8px base: `--space-1` (8px) through `--space-16` (128px). Section rhythm: `--space-section-x`, `--space-section-y`.

Text scale: `--text-2xs` (10px) to `--text-hero` (fluid). See tokens for full list.

---

*Last updated: March 2026*
