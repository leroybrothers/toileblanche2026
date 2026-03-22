#!/usr/bin/env node
/**
 * Lists images in each the-property cluster folder.
 * Run: node scripts/check-property-images.mjs
 */
import { readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, '..', 'public/assets/images/theproperty');
const IMG_EXT = /\.(jpg|jpeg|png|webp|avif)$/i;
const OPTIMIZED_VARIANT = /-\d+w\./i; // exclude -600w, -800w, -1200w variants

const CLUSTERS = [
  ['theplace', 'the-place'],
  ['thehouses', 'the-houses'],
  ['therooms', 'the-rooms'],
  ['thetable', 'the-table'],
  ['theart', 'the-art'],
  ['thegarden', 'the-garden'],
  ['theatmosphere', 'the-atmosphere'],
];
const EXPECTED = {
  'the-place': '2–4 (1st=hero, rest=portraits)',
  'the-houses': '3–5+ (2 landscapes, fullbleed, extras)',
  'the-rooms': '3–5 (portraits first, then landscapes)',
  'the-table': '3–4 (hero + portraits)',
  'the-art': '3 (2 landscapes + fullbleed)',
  'the-garden': '2–4 (hero, middle row, fullbleed)',
  'the-atmosphere': '10 (1st=hero, rest=3×3 grid)',
};

console.log('The Property — image inventory\n');
console.log('Folder: public/assets/images/theproperty/\n');
console.log('Images are used in alphabetical order. First file = first slot.\n');

for (const [folder, label] of CLUSTERS) {
  const dir = join(BASE, folder);
  const files = existsSync(dir)
    ? readdirSync(dir).filter((f) => IMG_EXT.test(f) && !OPTIMIZED_VARIANT.test(f)).sort()
    : [];
  const status = files.length > 0 ? `${files.length} file(s)` : 'empty (using placeholders)';
  console.log(`=== ${label} (${folder}/) — ${status}`);
  if (files.length) {
    files.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  }
  console.log('');
}
