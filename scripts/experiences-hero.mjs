/**
 * Process experiences hero image: PNG → JPG + -800w, -1200w variants.
 * Run: node scripts/experiences-hero.mjs
 */
import sharp from 'sharp';
import { stat } from 'fs/promises';
import { join } from 'path';

const SRC = '/Users/gregoryleroy/.cursor/projects/Users-gregoryleroy-Documents-GitHub-toileblanche/assets/DSCF0602-3eba49b4-3f10-4777-9ca3-6137c9b49c95.png';
const DIR = join(process.cwd(), 'public/assets/images');
const BASE = 'experiences-hero';
const QUALITY = 82;

async function run() {
  const img = sharp(SRC).rotate();
  const meta = await img.metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;

  // Base JPG (max 2400px)
  const outW = Math.min(w, 2400);
  const outH = Math.round((h * outW) / w);
  await img
    .clone()
    .resize(2400, null, { withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(join(DIR, `${BASE}.jpg`));
  console.log(`  ✓ ${BASE}.jpg  (${outW}×${outH})`);

  // -800w, -1200w
  for (const width of [800, 1200]) {
    const out = join(DIR, `${BASE}-${width}w.jpg`);
    await img
      .clone()
      .resize(width, null, { withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(out);
    console.log(`  ✓ ${BASE}-${width}w.jpg`);
  }

  console.log(`\nDimensions: ${w} × ${h}`);
}

run().catch(console.error);
