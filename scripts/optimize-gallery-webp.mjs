/**
 * Add WebP and AVIF variants for gallery/hero images (-600w, -800w, -1200w).
 * Run after optimize-restaurant-guinguette, optimize-slideshow, etc.
 * Usage: node scripts/optimize-gallery-webp.mjs
 */
import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const IMG = join(__dirname, '..', 'public', 'assets', 'images');
const WEBP_Q = 80;
const AVIF_Q = 65;

async function* walk(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) {
      yield* walk(join(dir, e.name), rel);
    } else if (e.isFile() && /-\d+w\.(jpg|jpeg|JPG|png)$/i.test(e.name)) {
      yield join(dir, e.name);
    }
  }
}

async function addWebpAvif(imgPath) {
  const rawExt = extname(imgPath);
  const ext = rawExt.toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return 0;
  const dir = dirname(imgPath);
  const fullName = basename(imgPath);
  const name = fullName.slice(0, -rawExt.length);
  const match = name.match(/^(.+)-(\d+)w$/);
  if (!match) return 0;
  const baseName = match[1];
  const suffix = `-${match[2]}w`;
  const outBase = baseName + suffix;
  let created = 0;

  const webpPath = join(dir, `${outBase}.webp`);
  try {
    await sharp(imgPath).webp({ quality: WEBP_Q }).toFile(webpPath);
    created++;
  } catch (e) {
    console.warn(`  ⚠ WebP ${outBase}.webp:`, e.message);
  }

  const avifPath = join(dir, `${outBase}.avif`);
  try {
    await sharp(imgPath).avif({ quality: AVIF_Q }).toFile(avifPath);
    created++;
  } catch (e) {
    console.warn(`  ⚠ AVIF ${outBase}.avif:`, e.message);
  }
  return created;
}

async function run() {
  console.log('Adding WebP/AVIF for gallery images...\n');
  let count = 0;
  for await (const p of walk(IMG)) {
    const added = await addWebpAvif(p);
    if (added) {
      count += added;
      const name = p.split('/').pop();
      console.log(`  ✓ ${name} → .webp, .avif`);
    }
  }
  console.log(`\nDone. Created ${count} files.`);
}

run().catch(console.error);
