#!/usr/bin/env node
/** Create parallax-pool variants from parallax-pool.png. Run: node scripts/optimize-parallax-pool.mjs */
import sharp from 'sharp';
import { stat } from 'fs/promises';
import { join } from 'path';

const BASE = 'public/assets/images';
const NAME = 'parallax-pool';
const INPUT = join(BASE, `${NAME}.png`);
const JPEG_QUALITY = 78;
const WEBP_QUALITY = 72;
const AVIF_QUALITY = 50;
const MAX_BASE_WIDTH = 1920;
const WIDTHS = [800, 1200];

const img = sharp(INPUT).rotate();
const meta = await img.metadata();

// Base: max 1920px, JPG + WebP + AVIF
await img.clone()
  .resize(MAX_BASE_WIDTH, null, { withoutEnlargement: true })
  .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
  .toFile(join(BASE, `${NAME}.jpg`));
await img.clone()
  .resize(MAX_BASE_WIDTH, null, { withoutEnlargement: true })
  .webp({ quality: WEBP_QUALITY })
  .toFile(join(BASE, `${NAME}.webp`));
await img.clone()
  .resize(MAX_BASE_WIDTH, null, { withoutEnlargement: true })
  .avif({ quality: AVIF_QUALITY })
  .toFile(join(BASE, `${NAME}.avif`));

// Variants
for (const w of WIDTHS) {
  const resizeW = meta.width ? Math.min(w, meta.width) : w;
  const pipe = img.clone().resize(resizeW, null, { withoutEnlargement: true });
  await pipe.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(join(BASE, `${NAME}-${w}w.jpg`));
  await img.clone().resize(resizeW, null, { withoutEnlargement: true }).webp({ quality: WEBP_QUALITY }).toFile(join(BASE, `${NAME}-${w}w.webp`));
  await img.clone().resize(resizeW, null, { withoutEnlargement: true }).avif({ quality: AVIF_QUALITY }).toFile(join(BASE, `${NAME}-${w}w.avif`));
}

console.log('✓ parallax-pool variants created');
