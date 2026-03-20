/**
 * Generate favicon sizes from source image.
 * Run: node scripts/generate-favicons.mjs [source.png]
 */
import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const SOURCE = process.argv[2] || join(__dirname, '..', 'public', 'assets', 'images', '63a19dacd6b229843a52a138_Toile Blanche Logo 2022 black.avif');

const SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function run() {
  console.log('Generating favicons from:', SOURCE);
  const img = sharp(SOURCE);

  for (const { name, size } of SIZES) {
    const outPath = join(PUBLIC, name);
    await img.clone().resize(size, size).png().toFile(outPath);
    console.log('  ✓', name);
  }

  // favicon.ico: copy 32x32 png (browsers accept PNG for favicon.ico)
  const png32 = await img.clone().resize(32, 32).png().toBuffer();
  await writeFile(join(PUBLIC, 'favicon.ico'), png32);
  console.log('  ✓ favicon.ico');
}

run().catch(console.error);
