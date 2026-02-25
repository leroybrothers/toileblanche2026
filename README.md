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
| **Weglot** (translations) | ❌ Removed | Re-add if needed: install Weglot script in `Layout.astro` |
| **Flodesk** (newsletter) | ❌ Removed | Newsletter form is now a plain HTML form — wire up to your email provider |
| **Elfsight** (reviews) | ❌ Removed | Re-add the Elfsight embed script if needed |

## Deploying

### Netlify (recommended — free tier)
1. Push this repo to GitHub
2. Connect to Netlify → "New site from Git"
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel
```bash
npm i -g vercel
vercel
```

### Any static host
Run `npm run build` and deploy the `dist/` folder.

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
