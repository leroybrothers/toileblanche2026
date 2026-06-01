#!/usr/bin/env node
/**
 * Lists /assets/images/... references in src + data that are not exact
 * matches to git-tracked files under public/ (case-sensitive, like Linux deploy).
 */
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const tracked = new Set(
  execSync('git ls-files public/', { encoding: 'utf8', cwd: root })
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((p) => p.replace(/^public/, '')),
);

const refs = new Set();

function walkJsonImages(o) {
  if (typeof o === 'string' && o.startsWith('/assets/images/')) refs.add(o);
  else if (Array.isArray(o)) o.forEach(walkJsonImages);
  else if (o && typeof o === 'object') Object.values(o).forEach(walkJsonImages);
}

/** Double-quoted /assets/images/... paths (handles spaces, apostrophes). */
function extractQuotedAssetPaths(filePath) {
  const s = readFileSync(filePath, 'utf8');
  const re = /"(\/assets\/images\/[^"]+)"/g;
  let m;
  while ((m = re.exec(s))) refs.add(m[1]);
}

function walkDirForQuoted(dir, exts) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkDirForQuoted(p, exts);
    else if (exts.has(extname(name))) extractQuotedAssetPaths(p);
  }
}

const QUOTE_SCAN_EXT = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.md', '.mdx', '.css']);

walkDirForQuoted(join(root, 'src'), QUOTE_SCAN_EXT);

for (const jf of [
  'src/data/suites.json',
  'src/data/suites.fr.json',
  'src/data/suite-gallery-categories.json',
]) {
  walkJsonImages(JSON.parse(readFileSync(join(root, jf), 'utf8')));
}

const missing = [];
for (const r of [...refs].sort()) {
  if (!tracked.has(r)) {
    const lower = r.toLowerCase();
    const alt = [...tracked].find((t) => t.toLowerCase() === lower);
    missing.push({ ref: r, caseAlt: alt ?? null });
  }
}

for (const m of missing) {
  if (m.caseAlt) process.stdout.write(`CASE\t${m.ref}\t${m.caseAlt}\n`);
  else process.stdout.write(`MISSING\t${m.ref}\n`);
}

process.stderr.write(`refs=${refs.size} missing=${missing.length}\n`);
