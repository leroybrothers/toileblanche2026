/**
 * Optimize restaurant and guinguette gallery images.
 * Generates -600w, -1200w variants (and replaces originals with 1800px max).
 * Run: node scripts/optimize-restaurant-guinguette.mjs
 */
import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join, basename, extname } from 'path';
import { RESIZE_OPTS, SHARPEN_OPTS, QUALITY } from './image-config.mjs';

const BASE = 'public/assets/images';
const GALLERY_SIZES = [1800, 1200, 600]; // base, then -1200w, -600w

const DIRS = ['restaurant', 'guinguette'];

function kb(bytes) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)}KB`
    : `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

async function processImage(filePath) {
  const dir = join(filePath, '..');
  const ext = extname(filePath);
  const name = basename(filePath, ext);
  const before = (await stat(filePath)).size;

  for (let i = 0; i < GALLERY_SIZES.length; i++) {
    const w = GALLERY_SIZES[i];
    const outName = i === 0 ? `${name}${ext}` : `${name}-${w}w${ext}`;
    const outPath = join(dir, outName);

    const pipeline = sharp(filePath)
      .rotate()
      .resize(w, null, RESIZE_OPTS)
      .sharpen(SHARPEN_OPTS)
      .jpeg({ quality: QUALITY.jpeg, mozjpeg: true });

    const tmp = outPath + '.tmp';
    await pipeline.toFile(tmp);
    const after = (await stat(tmp)).size;

    if (i === 0) {
      if (after < before) {
        await rename(tmp, outPath);
        const pct = ((1 - after / before) * 100).toFixed(0);
        console.log(`  ✓ ${name}${ext}  ${kb(before)} → ${kb(after)}  (-${pct}%)`);
      } else {
        await unlink(tmp).catch(() => {});
        console.log(`  · ${name}${ext}  kept (${kb(before)})`);
      }
    } else {
      await rename(tmp, outPath);
      console.log(`  + ${outName}  ${kb(after)}`);
    }
  }
}

async function run() {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const dirName of DIRS) {
    const dirPath = join(BASE, dirName);
    console.log(`\n── ${dirName} ──`);

    let files;
    try {
      files = await readdir(dirPath);
    } catch (e) {
      console.log(`  (directory not found, skipping)`);
      continue;
    }

    const images = files.filter(f =>
      ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()) &&
      !/-\d+w\./.test(f)
    );

    for (const file of images) {
      const fullPath = join(dirPath, file);
      const sizeBefore = (await stat(fullPath)).size;
      totalBefore += sizeBefore;

      await processImage(fullPath);

      const sizeAfter = (await stat(fullPath)).size;
      totalAfter += sizeAfter;
    }
  }

  console.log(`\n══ Summary ══`);
  console.log(`Processed originals: ${kb(totalBefore)}`);
  console.log(`After optimization: ${kb(totalAfter)}`);
}

run().catch(console.error);
