/**
 * Replace IMG_0365 with a new source image and create -600w, -1200w variants.
 * Run: node scripts/replace-art-image.mjs <source.png>
 */
import sharp from 'sharp';
import { join } from 'path';

const SOURCE = process.argv[2] || '.cursor/projects/Users-gregoryleroy-Documents-Github-toileblanche2026/assets/Aerts_8__1_-b51cc900-a1a1-412f-9165-292144a7d921.png';
const ART_DIR = 'public/assets/images/art';
const QUALITY = 82;
const GALLERY_WIDTHS = [600, 1200];

async function run() {
  const baseName = 'IMG_0365';
  const outBase = join(ART_DIR, `${baseName}.jpg`);

  console.log('Replacing art image...\n');

  // 1. Convert source to JPG (base)
  await sharp(SOURCE)
    .rotate()
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outBase);
  console.log(`  ✓ ${baseName}.jpg`);

  // 2. Create -600w and -1200w variants
  for (const w of GALLERY_WIDTHS) {
    const outPath = join(ART_DIR, `${baseName}-${w}w.jpg`);
    await sharp(SOURCE)
      .rotate()
      .resize(w, null, { withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(outPath);
    console.log(`  + ${baseName}-${w}w.jpg`);
  }

  console.log('\nDone.');
}

run().catch(console.error);
