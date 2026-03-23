/**
 * Optimize Homepage suite card images (slider on homepage).
 * Creates -400w and -800w variants. Card images are displayed at 33vw max.
 * Run: node scripts/optimize-homepage-cards.mjs
 */
import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join, basename, extname } from 'path';
import { RESIZE_OPTS, SHARPEN_OPTS, QUALITY } from './image-config.mjs';

const HOMEPAGE = 'public/assets/images/Homepage';
const CARD_WIDTHS = [1200, 800, 400];

// Suite card files from suites.json (card field) — use existing .jpg sources
const CARD_FILES = [
  'suite-penard.jpg',
  'Suite pétanque.jpg',
  'Suite bronzette.png',
  'Suite cabanat.jpg',
  "suite de l'artiste.JPG",
  'mas-de-l-artiste.jpg',
  'Villa pénéquet.jpg',
  'Suite bon vivant.JPG',
];

function kb(bytes) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)}KB`
    : `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

async function processCard(fileName) {
  const filePath = join(HOMEPAGE, fileName);
  let beforeTotal;
  try {
    beforeTotal = (await stat(filePath)).size;
  } catch {
    console.log(`  ⚠ ${fileName} not found, skipping`);
    return { before: 0, after: 0 };
  }

  const ext = extname(filePath);
  const name = basename(filePath, ext);
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

    const outName = `${name}-${w}w`;
    const jpgPath = join(dir, `${outName}.jpg`);
    await resized.clone().jpeg({ quality: QUALITY.jpeg, mozjpeg: true }).toFile(jpgPath);
    afterTotal += (await stat(jpgPath)).size;

    const webpPath = join(dir, `${outName}.webp`);
    await resized.clone().webp({ quality: QUALITY.webp }).toFile(webpPath);
    afterTotal += (await stat(webpPath)).size;

    const avifPath = join(dir, `${outName}.avif`);
    await resized.clone().avif({ quality: QUALITY.avif }).toFile(avifPath);
    afterTotal += (await stat(avifPath)).size;

    console.log(`  + ${outName}.jpg/.webp/.avif`);
  }

  // Resize base to 800w, output as .jpg
  const baseOutPath = join(dir, `${name}.jpg`);
  const baseResizeW = origW > 0 ? Math.min(800, origW) : 800;
  const tmpBase = baseOutPath + '.tmp';
  await img
    .clone()
    .resize(baseResizeW, null, RESIZE_OPTS)
    .sharpen(SHARPEN_OPTS)
    .jpeg({ quality: QUALITY.jpeg, mozjpeg: true })
    .toFile(tmpBase);

  const baseSize = (await stat(tmpBase)).size;
  await rename(tmpBase, baseOutPath);
  afterTotal += baseSize;
  console.log(`  ✓ ${name}.jpg  ${kb(baseSize)}  (base)`);

  return { before: beforeTotal, after: afterTotal };
}

async function run() {
  console.log('Optimizing Homepage suite card images...\n');
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of CARD_FILES) {
    const { before, after } = await processCard(file);
    totalBefore += before;
    totalAfter += after;
  }

  console.log('\n══ Summary ══');
  console.log(`Before: ${kb(totalBefore)}`);
  console.log(`After:  ${kb(totalAfter)}`);
  console.log(`Saved:  ${kb(totalBefore - totalAfter)}`);
}

run().catch(console.error);
