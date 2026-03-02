import sharp from 'sharp';
import { readdir, stat, rename, mkdir, unlink } from 'fs/promises';
import { join, basename, extname } from 'path';

const BASE = 'public/assets/images';
const QUALITY = 82;

const SUITE_DIRS = [
  'penard', 'petanque', 'bronzette', 'cabanat',
  'suite-artiste', 'mas-de-l-artiste', 'bon-vivant', 'penequet'
];

const SIZES = {
  hero:    [2400, 1200, 800],
  card:    [800, 400],
  gallery: [1800, 1200, 600],
};

function getSizeSet(name) {
  if (name === 'hero') return SIZES.hero;
  if (name === 'card') return SIZES.card;
  if (name.startsWith('gallery')) return SIZES.gallery;
  return null;
}

async function processImage(filePath, role) {
  const widths = getSizeSet(role);
  if (!widths) return;

  const dir = join(filePath, '..');
  const ext = extname(filePath);
  const name = basename(filePath, ext);
  const before = (await stat(filePath)).size;

  const meta = await sharp(filePath).metadata();
  let totalSaved = 0;

  for (const w of widths) {
    const outName = w === widths[0] ? `${name}${ext}` : `${name}-${w}w${ext}`;
    const outPath = join(dir, outName);

    const pipeline = sharp(filePath)
      .rotate()
      .resize(w, null, { withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true });

    const tmp = outPath + '.tmp';
    await pipeline.toFile(tmp);
    const after = (await stat(tmp)).size;

    if (w === widths[0]) {
      if (after < before) {
        await rename(tmp, outPath);
        const pct = ((1 - after / before) * 100).toFixed(0);
        console.log(`  ✓ ${name}${ext}  ${kb(before)} → ${kb(after)}  (-${pct}%)`);
        totalSaved += before - after;
      } else {
        await unlink(tmp).catch(() => {});
        console.log(`  · ${name}${ext}  already optimal (${kb(before)})`);
      }
    } else {
      await rename(tmp, outPath);
      console.log(`  + ${outName}  ${kb(after)}`);
    }
  }
}

function kb(bytes) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)}KB`
    : `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

async function run() {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const dir of SUITE_DIRS) {
    const dirPath = join(BASE, dir);
    console.log(`\n── ${dir} ──`);

    const files = await readdir(dirPath);
    const images = files.filter(f =>
      ['.jpg', '.jpeg'].includes(extname(f).toLowerCase()) &&
      !f.includes('-w.') && !/-\d+w\./.test(f)
    );

    for (const file of images) {
      const name = basename(file, extname(file));
      const role = name.startsWith('gallery') ? name : name;
      const fullPath = join(dirPath, file);

      const sizeBefore = (await stat(fullPath)).size;
      totalBefore += sizeBefore;

      await processImage(fullPath, role);

      const sizeAfter = (await stat(fullPath)).size;
      totalAfter += sizeAfter;
    }
  }

  console.log(`\n══ Summary ══`);
  console.log(`Original total: ${kb(totalBefore)}`);
  console.log(`Compressed total: ${kb(totalAfter)}`);
  console.log(`Saved: ${kb(totalBefore - totalAfter)}`);
}

run().catch(console.error);
