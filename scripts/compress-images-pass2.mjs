/**
 * Second pass: only files that are still large or wider than max dimension.
 * Uses a lower max width + JPEG quality than compress-images.mjs.
 * Run: node scripts/compress-images-pass2.mjs
 */
import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join, extname } from 'path';
import { RESIZE_OPTS, QUALITY_TIGHT } from './image-config.mjs';

const IMG_DIR = 'public/assets/images';
const MAX_WIDTH = 1600;
/** Process if at least this size (bytes) OR wider than MAX_WIDTH */
const MIN_BYTES = 280 * 1024;

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

async function compress() {
  const files = await getFiles(IMG_DIR);
  const imageExts = ['.jpg', '.jpeg', '.png'];
  const images = files.filter((f) => imageExts.includes(extname(f).toLowerCase()));

  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;
  let skipped = 0;
  let skippedSmall = 0;

  for (const file of images) {
    const ext = extname(file).toLowerCase();
    const before = (await stat(file)).size;

    let meta;
    try {
      meta = await sharp(file).metadata();
    } catch {
      skipped++;
      continue;
    }

    const wide = meta.width != null && meta.width > MAX_WIDTH;
    const heavy = before >= MIN_BYTES;
    if (!wide && !heavy) {
      skippedSmall++;
      continue;
    }

    totalBefore += before;

    try {
      let pipeline = sharp(file).rotate();

      if (meta.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, RESIZE_OPTS);
      }

      const tmp = file + '.tmp';

      if (ext === '.png') {
        await pipeline.png({ compressionLevel: 9, effort: 10 }).toFile(tmp);
      } else {
        await pipeline.jpeg({ quality: QUALITY_TIGHT.jpeg, mozjpeg: true }).toFile(tmp);
      }

      const after = (await stat(tmp)).size;

      if (after < before) {
        await rename(tmp, file);
        totalAfter += after;
        const pct = ((1 - after / before) * 100).toFixed(0);
        const sizeMB = (before / 1024 / 1024).toFixed(1);
        const newMB = (after / 1024 / 1024).toFixed(1);
        console.log(`✓ ${file.replace(IMG_DIR + '/', '')}  ${sizeMB}MB → ${newMB}MB  (-${pct}%)`);
        processed++;
      } else {
        const { unlink } = await import('fs/promises');
        await unlink(tmp).catch(() => {});
        totalAfter += before;
        skipped++;
      }
    } catch (e) {
      totalAfter += before;
      console.log(`✗ ${file.replace(IMG_DIR + '/', '')}  error: ${e.message}`);
      skipped++;
    }
  }

  console.log(`\n── Pass 2 (≥${(MIN_BYTES / 1024).toFixed(0)}KB or >${MAX_WIDTH}px wide) ──`);
  console.log(`Processed: ${processed}  Skipped (no gain / error): ${skipped}  Skipped (too small): ${skippedSmall}`);
  console.log(`Touched bytes before: ${(totalBefore / 1024 / 1024).toFixed(1)} MB  after: ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
  if (totalBefore > 0) {
    console.log(`Saved on touched files: ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)} MB`);
  }
}

compress();
