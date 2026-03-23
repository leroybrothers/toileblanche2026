import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join, extname } from 'path';
import { RESIZE_OPTS, QUALITY_COMPACT } from './image-config.mjs';

const IMG_DIR = 'public/assets/images';
const MAX_WIDTH = 2000;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function compress() {
  const files = await getFiles(IMG_DIR);
  const imageExts = ['.jpg', '.jpeg', '.png'];
  const images = files.filter(f => imageExts.includes(extname(f).toLowerCase()));

  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;
  let skipped = 0;

  for (const file of images) {
    const ext = extname(file).toLowerCase();
    const before = (await stat(file)).size;
    totalBefore += before;

    try {
      const img = sharp(file);
      const meta = await img.metadata();

      let pipeline = sharp(file).rotate(); // auto-rotate from EXIF

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
        const sizeMB = (before / 1024 / 1024).toFixed(1);
        const newMB = (after / 1024 / 1024).toFixed(1);
        console.log(`✓ ${file.replace(IMG_DIR + '/', '')}  ${sizeMB}MB → ${newMB}MB  (-${pct}%)`);
        processed++;
      } else {
        await rename(tmp, tmp).catch(() => {});
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

  console.log(`\n── Summary ──`);
  console.log(`Processed: ${processed} files`);
  console.log(`Skipped (already optimal): ${skipped} files`);
  console.log(`Before: ${(totalBefore / 1024 / 1024).toFixed(1)} MB`);
  console.log(`After:  ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Saved:  ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)} MB (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);
}

compress();
