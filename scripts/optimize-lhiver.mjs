/**
 * Resize + compress JPEG/PNG under public/assets/images/lhiver only.
 * Run: node scripts/optimize-lhiver.mjs
 */
import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join, extname } from 'path';
import { RESIZE_OPTS, QUALITY_COMPACT } from './image-config.mjs';

const IMG_DIR = 'public/assets/images/lhiver';
const MAX_WIDTH = 2000;

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

async function main() {
  const files = await getFiles(IMG_DIR);
  const imageExts = ['.jpg', '.jpeg', '.png'];
  const images = files.filter((f) => imageExts.includes(extname(f).toLowerCase()));

  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;
  let skipped = 0;

  for (const file of images) {
    const ext = extname(file).toLowerCase();
    const before = (await stat(file)).size;
    totalBefore += before;

    try {
      const meta = await sharp(file).metadata();
      let pipeline = sharp(file).rotate();

      if (meta.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, RESIZE_OPTS);
      }

      const tmp = file + '.tmp';

      if (ext === '.png') {
        await pipeline.png({ compressionLevel: 9, effort: 10 }).toFile(tmp);
      } else {
        await pipeline.jpeg({ quality: QUALITY_COMPACT.jpeg, mozjpeg: true }).toFile(tmp);
      }

      const after = (await stat(tmp)).size;

      if (after < before) {
        await rename(tmp, file);
        totalAfter += after;
        const pct = ((1 - after / before) * 100).toFixed(0);
        console.log(
          `✓ ${file.replace(/^public\//, '')}  ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB  (-${pct}%)`,
        );
        processed++;
      } else {
        const { unlink } = await import('fs/promises');
        await unlink(tmp).catch(() => {});
        totalAfter += before;
        skipped++;
      }
    } catch (e) {
      totalAfter += before;
      console.log(`✗ ${file}  ${e.message}`);
      skipped++;
    }
  }

  console.log(`\n── L'Hiver ──`);
  console.log(`Processed: ${processed}  Skipped: ${skipped}`);
  console.log(`Before: ${(totalBefore / 1024 / 1024).toFixed(1)} MB  After: ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
}

main();
