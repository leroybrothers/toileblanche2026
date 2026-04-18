/**
 * Pass 3: WebP + AVIF siblings for specific raster sources (paths known to src).
 * Run: node scripts/optimize-pass3-webp-assets.mjs
 */
import sharp from 'sharp';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { RESIZE_OPTS, QUALITY } from './image-config.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

/** Max width for very large sources */
const MAX_W = 1800;

const JOBS = [
  join(PUBLIC, 'assets', 'images', 'Lavieici', 'LARTISTE_INVITE.png'),
];

async function processOne(absPath) {
  const meta = await sharp(absPath).metadata();
  const dir = dirname(absPath);
  const baseName = absPath.replace(/^.*\//, '').replace(/\.[^.]+$/i, '');
  const webpPath = join(dir, `${baseName}.webp`);
  const avifPath = join(dir, `${baseName}.avif`);

  const pipeline = () => {
    let p = sharp(absPath).rotate();
    if (meta.width && meta.width > MAX_W) {
      p = p.resize(MAX_W, null, RESIZE_OPTS);
    }
    return p;
  };

  await pipeline().webp({ quality: QUALITY.webp }).toFile(webpPath);
  await pipeline().avif({ quality: QUALITY.avif }).toFile(avifPath);
  console.log(`✓ ${baseName}: .webp + .avif`);
}

async function main() {
  for (const p of JOBS) {
    try {
      await processOne(p);
    } catch (e) {
      console.error(`✗ ${p}:`, e.message);
    }
  }
}

main();
