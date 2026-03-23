#!/usr/bin/env node
/**
 * Create variants for homepage hero, parallax1 (pool), parallax2 (building).
 * Expects homepagehero1, parallax1, parallax2 (.jpg/.png) in public/assets/images.
 * Run: node scripts/optimize-parallax-pool.mjs
 */
import sharp from 'sharp';
import { join } from 'path';
import { existsSync } from 'fs';
import { rename } from 'fs/promises';
import { RESIZE_OPTS, SHARPEN_OPTS } from './image-config.mjs';

const BASE = 'public/assets/images';
const NAMES = ['homepagehero1', 'parallax1', 'parallax2'];
// 27" and larger: need 2880px+ for sharp full-screen. Base covers 2560px+ viewports.
const MAX_BASE_WIDTH = 3200;
const WIDTHS = [800, 1200, 1920, 2400];

function findInput(basePath, name) {
  for (const ext of ['.jpg', '.jpeg', '.png']) {
    const p = join(basePath, `${name}${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
}

async function processParallax(name) {
  const inputPath = findInput(BASE, name);
  if (!inputPath) {
    console.log(`  ⚠ ${name}.* not found, skipping`);
    return;
  }
  const img = sharp(inputPath).rotate();
  const meta = await img.metadata();

  // Base: max 3200px for large displays, JPG + WebP + AVIF
  // Write to .tmp first when output might overwrite input (e.g. parallax1.jpg → parallax1.jpg)
  const jpgOut = join(BASE, `${name}.jpg`);
  const jpgTmp = jpgOut + '.tmp';
  await img.clone()
    .resize(MAX_BASE_WIDTH, null, RESIZE_OPTS)
    .sharpen(SHARPEN_OPTS)
    .jpeg({ quality: 93, mozjpeg: true })
    .toFile(jpgTmp);
  await rename(jpgTmp, jpgOut);

  await img.clone()
    .resize(MAX_BASE_WIDTH, null, RESIZE_OPTS)
    .sharpen(SHARPEN_OPTS)
    .webp({ quality: 92 })
    .toFile(join(BASE, `${name}.webp`));
  await img.clone()
    .resize(MAX_BASE_WIDTH, null, RESIZE_OPTS)
    .sharpen(SHARPEN_OPTS)
    .avif({ quality: 78 })
    .toFile(join(BASE, `${name}.avif`));

  // Variants
  for (const w of WIDTHS) {
    const resizeW = meta.width ? Math.min(w, meta.width) : w;
    const pipe = img.clone().resize(resizeW, null, RESIZE_OPTS).sharpen(SHARPEN_OPTS);
    await pipe.jpeg({ quality: 93, mozjpeg: true }).toFile(join(BASE, `${name}-${w}w.jpg`));
    await img.clone().resize(resizeW, null, RESIZE_OPTS).sharpen(SHARPEN_OPTS).webp({ quality: 92 }).toFile(join(BASE, `${name}-${w}w.webp`));
    await img.clone().resize(resizeW, null, RESIZE_OPTS).sharpen(SHARPEN_OPTS).avif({ quality: 78 }).toFile(join(BASE, `${name}-${w}w.avif`));
  }
  console.log(`  ✓ ${name} variants created`);
}

async function run() {
  console.log('Optimizing parallax images...\n');
  for (const name of NAMES) {
    await processParallax(name);
  }
  console.log('\nDone.');
}

run().catch(console.error);
