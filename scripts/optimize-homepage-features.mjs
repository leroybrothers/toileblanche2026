/**
 * Optimize homepage feature block images (Art, Restaurants, Experiences)
 * and homepage-fullframe. Creates 524w, 800w variants in JPG, WebP, AVIF.
 * Run: node scripts/optimize-homepage-features.mjs
 */
import sharp from 'sharp';
import { stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { RESIZE_OPTS, SHARPEN_OPTS, QUALITY } from './image-config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMG = join(__dirname, '..', 'public', 'assets', 'images');

const WIDTHS = [524, 800];

async function processImage(sourcePath, baseName) {
  const img = sharp(sourcePath).rotate();
  const dir = dirname(sourcePath);
  let totalOut = 0;

  for (const w of WIDTHS) {
    const resized = img.clone()
      .resize(w, null, RESIZE_OPTS)
      .sharpen(SHARPEN_OPTS);

    const jpg = join(dir, `${baseName}-${w}w.jpg`);
    await resized.clone()
      .jpeg({ quality: QUALITY.jpeg, mozjpeg: true })
      .toFile(jpg);
    totalOut += (await stat(jpg)).size;

    const webp = join(dir, `${baseName}-${w}w.webp`);
    await resized.clone()
      .webp({ quality: QUALITY.webp })
      .toFile(webp);
    totalOut += (await stat(webp)).size;

    const avif = join(dir, `${baseName}-${w}w.avif`);
    await resized.clone()
      .avif({ quality: QUALITY.avif })
      .toFile(avif);
    totalOut += (await stat(avif)).size;
  }
  return totalOut;
}

async function processFullframe(sourcePath, baseName) {
  const dir = dirname(sourcePath);
  const img = sharp(sourcePath).rotate();

  const webp = join(dir, `${baseName}.webp`);
  await img.clone().webp({ quality: QUALITY.webp }).toFile(webp);

  const avif = join(dir, `${baseName}.avif`);
  await img.clone().avif({ quality: QUALITY.avif }).toFile(avif);

  return (await stat(webp)).size + (await stat(avif)).size;
}

async function run() {
  console.log('Optimizing homepage feature images...\n');

  // Art (Aerts)
  const aertsPath = join(IMG, '677ce5a0ffdffd79d9f89e13_Aerts 6 (1)-p-1600.jpg');
  const aertsBase = '677ce5a0ffdffd79d9f89e13_Aerts 6 (1)-p-1600';
  await processImage(aertsPath, aertsBase);
  console.log('  ✓ Aerts (Art block)');

  // Restaurants
  const restPath = join(IMG, 'restaurants-terrace.png');
  const restBase = 'restaurants-terrace';
  await processImage(restPath, restBase);
  console.log('  ✓ restaurants-terrace');

  // Experiences
  const expPath = join(IMG, 'Experiences.jpg');
  const expBase = 'Experiences';
  await processImage(expPath, expBase);
  console.log('  ✓ Experiences');

  // Homepage fullframe (CSS background)
  const ffPath = join(IMG, 'homepage-fullframe.png');
  const ffBase = 'homepage-fullframe';
  await processFullframe(ffPath, ffBase);
  console.log('  ✓ homepage-fullframe');

  console.log('\nDone. Update HTML/CSS to use new variants.');
}

run().catch(console.error);
