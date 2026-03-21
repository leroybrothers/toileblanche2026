#!/usr/bin/env node
/**
 * Generates press.json and press.fr.json clippings from PDFs in public/assets/press/
 * and thumbnails in public/assets/press/thumbnails/
 *
 * Run: node scripts/generate-press-clippings.mjs
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const PRESS_DIR = join(process.cwd(), 'public', 'assets', 'press');
const THUMB_DIR = join(PRESS_DIR, 'thumbnails');

// Format "CondeNastTraveller" -> "Condé Nast Traveller", "LeFigaroMagazine" -> "Le Figaro Magazine"
const formatPublication = (slug) => {
  const withSpaces = slug.replace(/([a-z])([A-Z])/g, '$1 $2');
  const known = {
    'Conde Nast Traveller': 'Condé Nast Traveller',
    'Conde Nast Traveler': 'Condé Nast Traveler',
    'Le Figaro Magazine': 'Le Figaro Magazine',
    'Le Monde': 'Le Monde',
    'Marie Claire Maison': 'Marie Claire Maison',
    'Cote Sud': 'Côte Sud',
    'Cote Magazine': 'Côte Magazine',
    'Art Et Deco': 'Art & Décoration',
    'Tout Ma': 'Tout Ma',
    'Voyager Ici Et Ailleurs': 'Voyager Ici et Ailleurs',
    'Gault Et Millau': 'Gault & Millau',
  };
  return known[withSpaces] || withSpaces;
};

const getYear = (datePart) => {
  const m = datePart.match(/^(\d{4})/);
  return m ? m[1] : '';
};

const articles = readdirSync(PRESS_DIR)
  .filter((f) => /\.(pdf|png)$/i.test(f))
  .map((filename) => {
    const base = filename.replace(/\.(pdf|png)$/i, '');
    const [datePart, ...rest] = base.split('_');
    const pubSlug = rest.slice(0, -2).join('_'); // Publication_Country_Type -> we want Publication
    const publication = formatPublication(pubSlug);
    const year = getYear(datePart);
    const ext = filename.match(/\.(pdf|png)$/i)[1].toLowerCase();
    const pdfPath = `/assets/press/${filename}`;
    const thumbPath = `/assets/press/thumbnails/${base}.jpg`;
    return { base, filename, publication, year, pdfPath, thumbPath, datePart };
  })
  .filter((a) => {
    const thumbs = readdirSync(THUMB_DIR);
    const hasThumb = thumbs.includes(`${a.base}.jpg`);
    if (!hasThumb) console.warn('Missing thumbnail for:', a.filename);
    return hasThumb;
  });

const valid = articles;

// Sort by date descending (newest first)
valid.sort((a, b) => {
  const da = a.datePart.replace('UNKNOWN', '99-99');
  const db = b.datePart.replace('UNKNOWN', '99-99');
  return db.localeCompare(da);
});

const clippings = valid.map(({ publication, year, pdfPath, thumbPath }) => ({
  publication,
  pdf: pdfPath,
  thumbnail: thumbPath,
  year,
}));

// Load existing JSON to preserve reviews
const pressPath = join(process.cwd(), 'src', 'data', 'press.json');
const pressFrPath = join(process.cwd(), 'src', 'data', 'press.fr.json');

const pressEn = JSON.parse(readFileSync(pressPath, 'utf-8'));
const pressFr = JSON.parse(readFileSync(pressFrPath, 'utf-8'));

pressEn.clippings = clippings;
pressFr.clippings = clippings;

writeFileSync(pressPath, JSON.stringify(pressEn, null, 2) + '\n');
writeFileSync(pressFrPath, JSON.stringify(pressFr, null, 2) + '\n');

console.log(`Updated press data with ${clippings.length} clippings.`);
