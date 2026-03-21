/**
 * Optimize slideshow images for hero use.
 * Creates -800w and -1200w variants (JPEG + WebP + AVIF), resizes base to max 1920px.
 * AVIF ~40% smaller than JPEG. Run: node scripts/optimize-slideshow-images.mjs
 */
import sharp from 'sharp';
import { stat, rename, unlink } from 'fs/promises';
import { join, basename, extname } from 'path';

const BASE = 'public/assets/images';
const JPEG_QUALITY = 78;
const WEBP_QUALITY = 72;
const AVIF_QUALITY = 50;
const MAX_BASE_WIDTH = 1920;
const HERO_WIDTHS = [800, 1200];

const SLIDESHOW_FILES = [
  'slideshow1.jpg',
  'slideshow5.jpg',
  'slideshow3.jpg',
];

function kb(bytes) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)}KB`
    : `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

async function processSlideshow(fileName) {
  const filePath = join(BASE, fileName);
  const ext = extname(filePath);
  const name = basename(filePath, ext);

  let beforeTotal = 0;
  try {
    beforeTotal = (await stat(filePath)).size;
  } catch {
    console.log(`  ⚠ ${fileName} not found, skipping`);
    return { before: 0, after: 0 };
  }

  const dir = join(filePath, '..');
  let afterTotal = 0;

  const img = sharp(filePath).rotate();
  const meta = await img.metadata();
  const origW = meta.width || 0;

  // 1. Resize base to max 1920px, output JPEG and WebP
  const baseOutPath = join(dir, `${name}${ext}`);
  const basePipeline = img.clone().resize(MAX_BASE_WIDTH, null, { withoutEnlargement: true });
  const tmpBase = baseOutPath + '.tmp';
  await basePipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmpBase);
  const baseSize = (await stat(tmpBase)).size;
  if (baseSize < beforeTotal) {
    await rename(tmpBase, baseOutPath);
    console.log(`  ✓ ${name}${ext}  ${kb(beforeTotal)} → ${kb(baseSize)}  (base)`);
  } else {
    await unlink(tmpBase).catch(() => {});
  }
  afterTotal += (await stat(baseOutPath)).size;

  const baseWebpPath = join(dir, `${name}.webp`);
  await img.clone()
    .resize(MAX_BASE_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(baseWebpPath);
  afterTotal += (await stat(baseWebpPath)).size;
  console.log(`  + ${name}.webp  ${kb((await stat(baseWebpPath)).size)}  (base)`);

  const baseAvifPath = join(dir, `${name}.avif`);
  await img.clone()
    .resize(MAX_BASE_WIDTH, null, { withoutEnlargement: true })
    .avif({ quality: AVIF_QUALITY })
    .toFile(baseAvifPath);
  afterTotal += (await stat(baseAvifPath)).size;
  console.log(`  + ${name}.avif  ${kb((await stat(baseAvifPath)).size)}  (base)`);

  // 2. Create -800w and -1200w variants (JPEG + WebP + AVIF)
  for (const w of HERO_WIDTHS) {
    const resizeW = origW > 0 ? Math.min(w, origW) : w;
    const outName = `${name}-${w}w${ext}`;
    const outPath = join(dir, outName);
    const tmp = outPath + '.tmp';
    await img.clone()
      .resize(resizeW, null, { withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(tmp);
    const size = (await stat(tmp)).size;
    await rename(tmp, outPath);
    afterTotal += size;
    console.log(`  + ${outName}  ${kb(size)}`);

    const webpName = `${name}-${w}w.webp`;
    const webpPath = join(dir, webpName);
    await img.clone()
      .resize(resizeW, null, { withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);
    afterTotal += (await stat(webpPath)).size;
    console.log(`  + ${webpName}  ${kb((await stat(webpPath)).size)}`);

    const avifName = `${name}-${w}w.avif`;
    const avifPath = join(dir, avifName);
    await img.clone()
      .resize(resizeW, null, { withoutEnlargement: true })
      .avif({ quality: AVIF_QUALITY })
      .toFile(avifPath);
    afterTotal += (await stat(avifPath)).size;
    console.log(`  + ${avifName}  ${kb((await stat(avifPath)).size)}`);
  }

  return { before: beforeTotal, after: afterTotal };
}

async function run() {
  console.log('Optimizing slideshow images...\n');
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of SLIDESHOW_FILES) {
    const { before, after } = await processSlideshow(file);
    totalBefore += before;
    totalAfter += after;
  }

  console.log('\n══ Summary ══');
  console.log(`Before: ${kb(totalBefore)}`);
  console.log(`After:  ${kb(totalAfter)}`);
  console.log(`Saved:  ${kb(totalBefore - totalAfter)}`);
}

run().catch(console.error);
