# Hero Video Integration — Toile Blanche

## Files delivered

```
public/assets/videos/
  hero-landscape.mp4         12 MB · 1280×720 · 21s · desktop/tablet
  hero-portrait.mp4           7 MB · 720×1280 · 18s · mobile
  hero-landscape-poster.jpg 108 KB · poster frame (LCP fallback, landscape)
  hero-portrait-poster.jpg   65 KB · poster frame (LCP fallback, portrait)
```

---

## 1. Update `src/pages/index.astro` (and `src/pages/fr/index.astro`)

**Find and replace** the hero background wrapper block (~lines 39–45):

```html
<!-- REMOVE THIS: -->
<div class="hero-bg-wrapper hero-bg-parallax">
  <div class="hero-bg-slide hero-bg-slide-1 is-active" role="img" aria-label="Toile Blanche, Saint-Paul de Vence"></div>
  <div class="hero-bg-slide hero-bg-slide-2" aria-hidden="true"></div>
  <div class="hero-bg-slide hero-bg-slide-3" aria-hidden="true"></div>
  <div class="hero-bg-slide hero-bg-slide-4" aria-hidden="true"></div>
  <div class="hero-bg-slide hero-bg-slide-5" aria-hidden="true"></div>
```

```html
<!-- REPLACE WITH THIS: -->
<div class="hero-bg-wrapper hero-bg-parallax hero-bg-video">

  <!-- Desktop & tablet (≥ 769px) — landscape 16:9 -->
  <video
    class="hero-video hero-video--landscape"
    autoplay muted loop playsinline
    preload="auto"
    poster="/assets/videos/hero-landscape-poster.jpg"
    aria-label="Toile Blanche, Saint-Paul de Vence"
  >
    <source src="/assets/videos/hero-landscape.mp4" type="video/mp4">
  </video>

  <!-- Mobile (≤ 768px portrait) — portrait 9:16 (lazy loaded) -->
  <video
    class="hero-video hero-video--portrait"
    autoplay muted loop playsinline
    preload="none"
    poster="/assets/videos/hero-portrait-poster.jpg"
    aria-hidden="true"
  >
    <source src="/assets/videos/hero-portrait.mp4" type="video/mp4">
  </video>
```

> The closing `</div>` that was already there stays as-is.
> The `.hero-bg-overlay` and `.hero1-content-wrapper` below are unaffected.

---

## 2. Update `src/layouts/Layout.astro` — LCP preload

Find the existing preload line:
```html
<link rel="preload" as="image" href="/assets/images/slideshow1.jpg" fetchpriority="high" />
```

Replace with the video poster preload:
```html
<link rel="preload" as="image" href="/assets/videos/hero-landscape-poster.jpg" fetchpriority="high" />
```

This ensures the poster frame renders instantly while the video loads, maintaining your LCP score.

---

## 3. Add CSS to `src/styles/site-overrides.css`

Append at the bottom:

```css
/* ─── Hero video background ──────────────────────────────────────────────── */
.hero-bg-video {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

/* Desktop default: landscape visible, portrait hidden */
.hero-video--portrait {
  display: none;
}

/* Mobile portrait orientation: swap to portrait video */
@media (max-width: 768px) and (orientation: portrait) {
  .hero-video--landscape {
    display: none;
  }
  .hero-video--portrait {
    display: block;
  }
}
```

---

## 4. The JS slideshow — no changes needed

`site.js` checks `if (slides.length === 0) return;` — since the `.hero-bg-slide` divs are removed, the slideshow silently does nothing. ✓

---

## How it works across devices

| Device | Video served | Dimensions |
|--------|-------------|------------|
| Desktop (≥ 1200px) | `hero-landscape.mp4` | 1280×720, fills full-bleed |
| Tablet landscape | `hero-landscape.mp4` | same |
| Mobile portrait | `hero-portrait.mp4` | 720×1280, fills tall screen |
| No autoplay (e.g. reduced motion) | Poster JPEG shown | instant paint |

The `object-fit: cover` + `object-position: center` ensures both videos fill the hero perfectly at any screen size or aspect ratio.
