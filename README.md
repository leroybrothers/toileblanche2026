# Toile Blanche – Astro Website

A rebuild of [toileblanche.com](https://www.toileblanche.com) on [Astro](https://astro.build) — an open, fast static site framework. Migrated from Webflow.

## Getting Started

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))

### Install & Run

```bash
# Install dependencies
npm install

# Start the dev server (opens at http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
toileblanche-astro/
├── public/
│   ├── assets/
│   │   ├── images/      ← All site images (migrated from Webflow CDN)
│   │   ├── fonts/       ← Self-hosted fonts
│   │   └── video/       ← Hero background video
│   ├── css/
│   │   ├── toile-blanche.min.css   ← Original Webflow stylesheet
│   │   └── site-overrides.css      ← Custom enhancements
│   └── js/
│       └── site.js      ← Custom JS (menu, slider, animations)
│
├── src/
│   ├── layouts/
│   │   └── Layout.astro            ← Base HTML layout (GTM, Mews, meta)
│   ├── components/
│   │   ├── Nav.astro               ← Navigation (dark + light variants)
│   │   ├── Footer.astro            ← Site footer
│   │   └── StubPage.astro          ← Template for pages-to-be-built
│   └── pages/
│       ├── index.astro             ← Homepage ✅ (fully built)
│       ├── suites/                 ← Ready for your content
│       ├── restaurants/
│       ├── art/
│       ├── experiences/
│       ├── shop/
│       ├── blog/
│       ├── faq/
│       ├── contact/
│       ├── gift-vouchers/
│       ├── upcoming-events/
│       ├── press/
│       ├── careers/
│       ├── privacy-policy/
│       ├── terms-of-use/
│       ├── booking-conditions/
│       ├── environmental-and-social-strategy/
│       └── 404.astro
│
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Third-Party Integrations

| Service | Status | Notes |
|---|---|---|
| **Mews** (booking) | ✅ Active | Configured in `Layout.astro`. Opens on `.distributor-open` clicks. |
| **Google Tag Manager** | ✅ Active | GTM ID: `GTM-52R8BBP`. Consent Mode V2 included. |
| **Flodesk** (newsletter) | ✅ Active | `api/newsletter.js` (Vercel) or `netlify/functions/newsletter.js` (Netlify). Requires `FLODESK_API_KEY`. |
| **Weglot** (translations) | ❌ Removed | Re-add if needed: install Weglot script in `Layout.astro` |
| **Elfsight** (reviews) | ❌ Removed | Re-add the Elfsight embed script if needed |

## Environment Variables

Set these in your deployment platform (Vercel / Netlify):

| Variable | Required | Notes |
|---|---|---|
| `FLODESK_API_KEY` | Yes | Flodesk API key for newsletter signups. Get from [Flodesk Settings → Integrations → API](https://app.flodesk.com/integrations). |
| `FLODESK_SEGMENT_ID` | No | Optional segment ID to add subscribers to a specific Flodesk segment. |

## Deploying

### Vercel (recommended — newsletter API works out of the box)
1. Push to GitHub and connect to Vercel
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set `FLODESK_API_KEY` in Vercel → Settings → Environment Variables

### Netlify
1. Push to GitHub and connect to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set `FLODESK_API_KEY` in Netlify → Site settings → Environment variables
5. Newsletter API is served by `netlify/functions/newsletter.js` (redirect configured in `netlify.toml`)

### Any static host
Run `npm run build` and deploy the `dist/` folder. Newsletter will not work unless you add a serverless function or proxy to Flodesk.

## Adding Content to Stub Pages

Each stub page at `src/pages/[name]/index.astro` uses the `StubPage` component.
To add content, replace the `StubPage` component with a full page layout and add your HTML/components inside.

Example for `/suites`:
```astro
---
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
---
<Layout title="Suites | Toile Blanche">
  <Nav theme="light" />
  <!-- Your suites content here -->
  <Footer />
</Layout>
```

## Notes

- All images are self-hosted in `public/assets/images/` (migrated from the Webflow CDN)
- The original Webflow CSS is preserved as-is in `public/css/toile-blanche.min.css`
- Custom enhancements (scroll animations, menu toggle, slider) live in `public/js/site.js`
- The hero video is in `public/assets/video/`
# toileblanche
