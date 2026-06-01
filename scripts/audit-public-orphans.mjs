/**
 * Heuristic: list public/ files whose full path never appears in src, scripts,
 * public/css, public/js, astro.config, vercel.json.
 * Webflow bundles often reference assets by shortened/hashed names — expect many
 * false "orphans". Do not bulk-delete; use only as a hint alongside dist/ review.
 * Run: npm run audit:public-orphans
 */
import { readdir, readFile } from 'fs/promises';
import { join, relative, sep } from 'path';

const ROOT = process.cwd();
const PUBLIC = join(ROOT, 'public');

const SOURCE_ROOTS = [join(ROOT, 'src'), join(ROOT, 'scripts')];
const EXTRA_FILES = [join(ROOT, 'astro.config.mjs'), join(ROOT, 'vercel.json')];
/** Bundled Webflow CSS/JS reference assets by filename — include to cut false orphans */
const PUBLIC_TEXT_ROOTS = [join(ROOT, 'public', 'css'), join(ROOT, 'public', 'js')];

const SKIP_NAMES = new Set(['.DS_Store', 'Thumbs.db']);
const TEXT_EXT = new Set([
  'astro',
  'ts',
  'tsx',
  'js',
  'mjs',
  'cjs',
  'json',
  'css',
  'html',
  'md',
  'svg',
  'txt',
  'xml',
]);

async function collectSourceFiles(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      await collectSourceFiles(p, out);
    } else {
      const ext = e.name.includes('.') ? e.name.split('.').pop() : '';
      if (TEXT_EXT.has(ext)) out.push(p);
    }
  }
  return out;
}

async function collectPublicFiles(dir, base = dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      await collectPublicFiles(p, base, out);
    } else if (!SKIP_NAMES.has(e.name)) {
      out.push(p);
    }
  }
  return out;
}

function toPosix(p) {
  return p.split(sep).join('/');
}

function variants(relPosix) {
  const enc = relPosix
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  const set = new Set([
    relPosix,
    '/' + relPosix,
    enc,
    '/' + enc,
  ]);
  return [...set];
}

async function main() {
  const files = [];
  for (const root of SOURCE_ROOTS) {
    await collectSourceFiles(root, files);
  }
  for (const f of EXTRA_FILES) {
    try {
      await readFile(f, 'utf8');
      files.push(f);
    } catch {
      /* skip */
    }
  }
  for (const root of PUBLIC_TEXT_ROOTS) {
    await collectSourceFiles(root, files);
  }

  let haystack = '';
  for (const f of files) {
    try {
      haystack += '\n' + (await readFile(f, 'utf8'));
    } catch {
      /* skip */
    }
  }

  const publicFiles = await collectPublicFiles(PUBLIC);
  const orphans = [];

  for (const abs of publicFiles) {
    const rel = toPosix(relative(PUBLIC, abs));
    let found = false;
    for (const v of variants(rel)) {
      if (haystack.includes(v)) {
        found = true;
        break;
      }
    }
    if (!found) orphans.push(rel);
  }

  orphans.sort();
  console.log(`── public/ files with no path match in src + scripts (+ astro/vercel) ──`);
  console.log(`Total public files: ${publicFiles.length}`);
  console.log(`Candidates (review manually): ${orphans.length}\n`);
  for (const o of orphans) console.log(o);
}

main();
