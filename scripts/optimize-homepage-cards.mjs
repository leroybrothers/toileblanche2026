/**
 * Optimize Homepage suite card images (slider on homepage).
 * Creates 400w, 800w, 1200w, 1800w. 1800w covers Retina at 33vw on 2560px screens.
 * Run: node scripts/optimize-homepage-cards.mjs
 * Replace pixelated sources in this folder, then re-run. See CARD-SOURCES.md.
 */
import sharp from 'sharp';
import { stat, rename } from 'fs/promises';
import { existsSync } from 'fs';
import { join, basename, extname } from 'path';
import { RESIZE_OPTS, SHARPEN_OPTS } from './image-config.mjs';

const HOMEPAGE = 'public/assets/images/Homepage';
const CARD_WIDTHS = [1800, 1200, 800, 400];
const JPEG_Q = 93;
const WEBP_Q = 92;
const AVIF_Q = 78;

// Suite card sources (Homepage folder) — script finds first that exists (.jpg, .jpeg, .png)
// Cabanat uses cabanat/hero.jpg, not Homepage
const CARD_NAMES = [
  'suite-penard',
  'Suite pétanque',
  'Suite bronzette',
  "suite de l'artiste",
  'mas-de-l-artiste',
  'Villa pénéquet',
  'Suite bon vivant',
];
const CARD_EXTS = ['.jpg', '.jpeg', '.png', '.JPG', '.PNG'];

function kb(bytes) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)}KB`
    : `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function findCardFile(baseName) {
  for (const ext of CARD_EXTS) {
    const p = join(HOMEPAGE, baseName + ext);
    if (existsSync(p)) return p;
  }
  return null;
}

async function processCard(baseName) {
  const filePath = findCardFile(baseName);
  if (!filePath) {
    console.log(`  ⚠ ${baseName}.* not found, skipping`);
    return { before: 0, after: 0 };
  }
  let beforeTotal = (await stat(filePath)).size;

  const ext = extname(filePath);
  const outBase = basename(filePath, ext);
  const dir = join(filePath, '..');
  const outExt = '.jpg';
  let afterTotal = 0;

  const img = sharp(filePath).rotate();
  const meta = await img.metadata();
  const origW = meta.width || 0;

  for (const w of CARD_WIDTHS) {
    const resizeW = origW > 0 ? Math.min(w, origW) : w;
    const resized = img.clone()
      .resize(resizeW, null, RESIZE_OPTS)
      .sharpen(SHARPEN_OPTS);

    const outName = `${outBase}-${w}w`;
    const jpgPath = join(dir, `${outName}.jpg`);
    await resized.clone().jpeg({ quality: JPEG_Q, mozjpeg: true }).toFile(jpgPath);
    afterTotal += (await stat(jpgPath)).size;

    const webpPath = join(dir, `${outName}.webp`);
    await resized.clone().webp({ quality: WEBP_Q }).toFile(webpPath);
    afterTotal += (await stat(webpPath)).size;

    const avifPath = join(dir, `${outName}.avif`);
    await resized.clone().avif({ quality: AVIF_Q }).toFile(avifPath);
    afterTotal += (await stat(avifPath)).size;

    console.log(`  + ${outName}.jpg/.webp/.avif`);
  }

  // Base = 800w for fallback. Use .tmp to avoid same-file error when input is .jpg
  const baseOutPath = join(dir, `${outBase}.jpg`);
  const baseResizeW = origW > 0 ? Math.min(800, origW) : 800;
  const tmpBase = baseOutPath + '.tmp';
  await img
    .clone()
    .resize(baseResizeW, null, RESIZE_OPTS)
    .sharpen(SHARPEN_OPTS)
    .jpeg({ quality: JPEG_Q, mozjpeg: true })
    .toFile(tmpBase);

  const baseSize = (await stat(tmpBase)).size;
  await rename(tmpBase, baseOutPath);
  afterTotal += baseSize;
  console.log(`  ✓ ${outBase}.jpg  ${kb(baseSize)}  (base)`);

  return { before: beforeTotal, after: afterTotal };
}

async function run() {
  console.log('Optimizing Homepage suite card images...\n');
  let totalBefore = 0;
  let totalAfter = 0;

  for (const name of CARD_NAMES) {
    const { before, after } = await processCard(name);
    totalBefore += before;
    totalAfter += after;
  }

  console.log('\n══ Summary ══');
  console.log(`Before: ${kb(totalBefore)}`);
  console.log(`After:  ${kb(totalAfter)}`);
  console.log(`Saved:  ${kb(totalBefore - totalAfter)}`);
}

run().catch(console.error);
