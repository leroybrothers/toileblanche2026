#!/usr/bin/env node
/**
 * Optimize archive images for web (resize to max 1200px, compress).
 * Run: node scripts/optimize-archive-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join, extname } from 'path';
import { RESIZE_OPTS, SHARPEN_OPTS, QUALITY_COMPACT } from './image-config.mjs';

const ARCHIVE_DIR = 'public/assets/images/archive';
const MAX_WIDTH = 1200;

function kb(bytes) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)}KB`
    : `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

async function optimize(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const before = (await stat(filePath)).size;
  const meta = await sharp(filePath).metadata();
  const needsResize = meta.width > MAX_WIDTH;

  const tmpPath = filePath + '.tmp';
  let pipeline = sharp(filePath).rotate();
  if (needsResize) {
    pipeline = pipeline.resize(MAX_WIDTH, null, RESIZE_OPTS).sharpen(SHARPEN_OPTS);
  }

  if (ext === '.png') {
    await pipeline.png({ compressionLevel: 9 }).toFile(tmpPath);
  } else {
    await pipeline.jpeg({ quality: QUALITY_COMPACT.jpeg, mozjpeg: true }).toFile(tmpPath);
  }

  await rename(tmpPath, filePath);
  const after = (await stat(filePath)).size;
  console.log(`  ✓ ${filePath.split('/').pop()}  ${kb(before)} → ${kb(after)}`);
  return { before, after };
}

async function run() {
  console.log('Optimizing archive images...\n');
  const files = await readdir(ARCHIVE_DIR);
  const images = files.filter(f => ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()));

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of images) {
    const fullPath = join(ARCHIVE_DIR, file);
    try {
      const { before, after } = await optimize(fullPath);
      totalBefore += before;
      totalAfter += after;
    } catch (err) {
      console.error(`  ✗ ${file}:`, err.message);
    }
  }

  console.log(`\nSaved: ${kb(totalBefore - totalAfter)}`);
}

run().catch(console.error);
