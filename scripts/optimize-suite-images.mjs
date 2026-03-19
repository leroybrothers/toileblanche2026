import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join, basename, extname, relative } from 'path';

const BASE = 'public/assets/images';
const QUALITY = 82;

const SUITE_DIRS = [
  'penard', 'petanque', 'bronzette', 'cabanat',
  'suite-artiste', 'mas-de-l-artiste', 'bon-vivant', 'penequet'
];

const GALLERY_ONLY_DIRS = ['restaurant', 'guinguette', 'sessions'];

// Additional dirs with gallery images (and subdirs); hero images use StP25* filename pattern
const EXTRA_GALLERY_DIRS = ['art', 'breakfast', 'ambiance', 'aboutgrid', 'pools'];

const SIZES = {
  hero:    [2400, 1200, 800],
  card:    [800, 400],
  gallery: [1800, 1200, 600],
};

function getSizeSet(name, opts = {}) {
  const { isGalleryOnlyDir } = opts;
  if (name === 'hero') return SIZES.hero;
  if (name === 'card') return SIZES.card;
  // Art/breakfast hero images use StP25* or GaelleSimon pattern — need hero srcset (800, 1200)
  if (/StP25|GaelleSimon/i.test(name)) return SIZES.hero;
  if (isGalleryOnlyDir) return SIZES.gallery;
  return SIZES.gallery;
}

async function processImage(filePath, role, opts = {}) {
  const widths = getSizeSet(role, opts);
  if (!widths) return;

  const dir = join(filePath, '..');
  const ext = extname(filePath);
  const name = basename(filePath, ext);
  const before = (await stat(filePath)).size;
  const outExt = ['.jpg', '.jpeg'].includes(ext.toLowerCase()) ? ext : '.jpg';
  let sourcePath = filePath;

  for (const w of widths) {
    const outName = w === widths[0] ? `${name}${outExt}` : `${name}-${w}w${outExt}`;
    const outPath = join(dir, outName);

    const pipeline = sharp(sourcePath)
      .rotate()
      .resize(w, null, { withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true });

    const tmp = outPath + '.tmp';
    await pipeline.toFile(tmp);
    const after = (await stat(tmp)).size;

    if (w === widths[0]) {
      if (after < before || ext.toLowerCase() === '.png') {
        if (ext.toLowerCase() === '.png') await unlink(filePath).catch(() => {});
        await rename(tmp, outPath);
        sourcePath = outPath; // use new path for subsequent iterations (PNG→JPG case)
        const pct = ((1 - after / before) * 100).toFixed(0);
        console.log(`  ✓ ${name}${ext} → ${outName}  ${kb(before)} → ${kb(after)}  (-${pct}%)`);
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

async function getImageFiles(dirPath, basePath = BASE) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getImageFiles(full, basePath));
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
      if (/-\d+w\./.test(entry.name)) continue;
      files.push(full);
    }
  }
  return files;
}

async function run() {
  let totalBefore = 0;
  let totalAfter = 0;

  const allDirs = [...SUITE_DIRS, ...GALLERY_ONLY_DIRS, ...EXTRA_GALLERY_DIRS];
  for (const dir of allDirs) {
    const dirPath = join(BASE, dir);
    const isGalleryOnly = GALLERY_ONLY_DIRS.includes(dir) || EXTRA_GALLERY_DIRS.includes(dir);
    let files;
    try {
      files = await getImageFiles(dirPath);
    } catch (e) {
      console.log(`\n── ${dir} ── (directory not found, skipping)`);
      continue;
    }
    if (files.length === 0) continue;
    console.log(`\n── ${dir} ${isGalleryOnly ? '(gallery)' : ''} ──`);

    for (const fullPath of files) {
      const name = basename(fullPath, extname(fullPath));
      const ext = extname(fullPath);
      const sizeBefore = (await stat(fullPath)).size;
      totalBefore += sizeBefore;

      await processImage(fullPath, name, { isGalleryOnlyDir: isGalleryOnly, relPath: relative(BASE, fullPath) });

      const pathAfter = ext.toLowerCase() === '.png' ? join(fullPath, '..', name + '.jpg') : fullPath;
      totalAfter += (await stat(pathAfter)).size;
    }
  }

  console.log(`\n══ Summary ══`);
  console.log(`Original total: ${kb(totalBefore)}`);
  console.log(`Compressed total: ${kb(totalAfter)}`);
  console.log(`Saved: ${kb(totalBefore - totalAfter)}`);
}

run().catch(console.error);
