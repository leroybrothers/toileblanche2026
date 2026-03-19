/**
 * Optimize slideshow images for hero use.
 * Creates -800w and -1200w variants for heroSrcset, and resizes base to max 1920px.
 * Run: node scripts/optimize-slideshow-images.mjs
 */
import sharp from 'sharp';
import { stat, rename, unlink } from 'fs/promises';
import { join, basename, extname } from 'path';

const BASE = 'public/assets/images';
const QUALITY = 82;
const MAX_BASE_WIDTH = 1920;
const HERO_WIDTHS = [800, 1200];

const SLIDESHOW_FILES = [
  'slideshow1.jpg',
  'slideshow2.JPG',
  'slideshow3.jpg',
  'slideshow4.JPG',
  'slideshow5.jpg',
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

  // 1. Resize base to max 1920px and compress
  const baseOutPath = join(dir, `${name}${ext}`);
  const pipeline = sharp(filePath)
    .rotate()
    .resize(MAX_BASE_WIDTH, null, { withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true });
  const tmpBase = baseOutPath + '.tmp';
  await pipeline.toFile(tmpBase);
  const baseSize = (await stat(tmpBase)).size;
  if (baseSize < beforeTotal) {
    await rename(tmpBase, baseOutPath);
    console.log(`  ✓ ${name}${ext}  ${kb(beforeTotal)} → ${kb(baseSize)}  (base)`);
  } else {
    await unlink(tmpBase).catch(() => {});
  }
  afterTotal += (await stat(baseOutPath)).size;

  // 2. Create -800w and -1200w variants
  for (const w of HERO_WIDTHS) {
    const outName = `${name}-${w}w${ext}`;
    const outPath = join(dir, outName);
    const tmp = outPath + '.tmp';
    await sharp(filePath)
      .rotate()
      .resize(w, null, { withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(tmp);
    const size = (await stat(tmp)).size;
    await rename(tmp, outPath);
    afterTotal += size;
    console.log(`  + ${outName}  ${kb(size)}`);
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
