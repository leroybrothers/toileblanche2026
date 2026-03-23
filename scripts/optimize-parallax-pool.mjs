#!/usr/bin/env node
/** Create parallax-pool variants from parallax-pool.png. Run: node scripts/optimize-parallax-pool.mjs */
import sharp from 'sharp';
import { join } from 'path';
import { RESIZE_OPTS, SHARPEN_OPTS, QUALITY } from './image-config.mjs';

const BASE = 'public/assets/images';
const NAME = 'parallax-pool';
const INPUT = join(BASE, `${NAME}.png`);
const MAX_BASE_WIDTH = 1920;
const WIDTHS = [800, 1200];

const img = sharp(INPUT).rotate();
const meta = await img.metadata();

// Base: max 1920px, JPG + WebP + AVIF
await img.clone()
  .resize(MAX_BASE_WIDTH, null, RESIZE_OPTS)
  .sharpen(SHARPEN_OPTS)
  .jpeg({ quality: QUALITY.jpeg, mozjpeg: true })
  .toFile(join(BASE, `${NAME}.jpg`));
await img.clone()
  .resize(MAX_BASE_WIDTH, null, RESIZE_OPTS)
  .sharpen(SHARPEN_OPTS)
  .webp({ quality: QUALITY.webp })
  .toFile(join(BASE, `${NAME}.webp`));
await img.clone()
  .resize(MAX_BASE_WIDTH, null, RESIZE_OPTS)
  .sharpen(SHARPEN_OPTS)
  .avif({ quality: QUALITY.avif })
  .toFile(join(BASE, `${NAME}.avif`));

// Variants
for (const w of WIDTHS) {
  const resizeW = meta.width ? Math.min(w, meta.width) : w;
  const pipe = img.clone().resize(resizeW, null, RESIZE_OPTS).sharpen(SHARPEN_OPTS);
  await pipe.jpeg({ quality: QUALITY.jpeg, mozjpeg: true }).toFile(join(BASE, `${NAME}-${w}w.jpg`));
  await img.clone().resize(resizeW, null, RESIZE_OPTS).sharpen(SHARPEN_OPTS).webp({ quality: QUALITY.webp }).toFile(join(BASE, `${NAME}-${w}w.webp`));
  await img.clone().resize(resizeW, null, RESIZE_OPTS).sharpen(SHARPEN_OPTS).avif({ quality: QUALITY.avif }).toFile(join(BASE, `${NAME}-${w}w.avif`));
}

console.log('✓ parallax-pool variants created');
