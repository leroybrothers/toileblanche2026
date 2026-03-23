/**
 * Encode path for use in src/srcset (handles spaces in filenames).
 * Use for any image path that may contain spaces (e.g. "DSCF4081 2.JPG").
 */
export function encodePath(path: string): string {
  return encodeURI(path);
}

export function srcset(path: string, widths: number[]): string {
  const ext = path.substring(path.lastIndexOf('.'));
  const base = path.substring(0, path.lastIndexOf('.'));
  const parts = widths.map((w) => `${encodePath(`${base}-${w}w${ext}`)} ${w}w`);
  parts.push(`${encodePath(path)} ${widths[widths.length - 1]! * 2}w`);
  return parts.join(', ');
}

/** Same as srcset but for WebP (expects -600w.webp etc. from optimize-gallery-webp). */
export function srcsetWebp(path: string, widths: number[]): string {
  const base = path.substring(0, path.lastIndexOf('.'));
  return widths.map((w) => `${encodePath(`${base}-${w}w.webp`)} ${w}w`).join(', ');
}

/** Same as srcset but for AVIF. */
export function srcsetAvif(path: string, widths: number[]): string {
  const base = path.substring(0, path.lastIndexOf('.'));
  return widths.map((w) => `${encodePath(`${base}-${w}w.avif`)} ${w}w`).join(', ');
}

export const heroSrcset = (p: string) => srcset(p, [800, 1200]);
export const gallerySrcset = (p: string) => srcset(p, [600, 1200]);
export const singleWidthSrcset = (p: string, w: number) => srcset(p, [w]);

/** Homepage suite cards: 400, 800, 1200, 1800 (matches optimize-homepage-cards output). */
export const cardSrcset = (p: string) => srcset(p, [400, 800, 1200, 1800]);
