/**
 * Pass 3 (JPEG only): remaining very heavy photos — tighter cap + quality.
 * Only files ≥ 750KB. Run after pass 2.
 * Run: node scripts/compress-images-pass3.mjs
 */
import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join, extname } from 'path';
import { RESIZE_OPTS } from './image-config.mjs';

const IMG_DIR = 'public/assets/images';
const MAX_WIDTH = 1400;
const MIN_BYTES = 750 * 1024;
const JPEG_Q = 78;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFiles(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function run() {
  const files = await getFiles(IMG_DIR);
  const jpgs = files.filter((f) => ['.jpg', '.jpeg'].includes(extname(f).toLowerCase()));

  let processed = 0;
  let skipped = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of jpgs) {
    const before = (await stat(file)).size;
    if (before < MIN_BYTES) continue;

    totalBefore += before;
    try {
      const meta = await sharp(file).metadata();
      let pipeline = sharp(file).rotate();
      if (meta.width && meta.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, RESIZE_OPTS);
      }
      const tmp = file + '.tmp';
      await pipeline.jpeg({ quality: JPEG_Q, mozjpeg: true }).toFile(tmp);
      const after = (await stat(tmp)).size;
      if (after < before) {
        await rename(tmp, file);
        console.log(
          `✓ ${file.replace(IMG_DIR + '/', '')}  ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB`,
        );
        totalAfter += after;
        processed++;
      } else {
        const { unlink } = await import('fs/promises');
        await unlink(tmp).catch(() => {});
        totalAfter += before;
        skipped++;
      }
    } catch (e) {
      console.log(`✗ ${file} ${e.message}`);
      totalAfter += before;
      skipped++;
    }
  }

  console.log(`\n── Pass 3 JPEG (≥${MIN_BYTES / 1024}KB) max ${MAX_WIDTH}px q${JPEG_Q} ──`);
  console.log(`Processed: ${processed}  skipped: ${skipped}`);
  if (totalBefore > 0) {
    console.log(`Saved: ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)} MB`);
  }
}

run();
