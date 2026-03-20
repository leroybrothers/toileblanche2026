/**
 * Generate srcset string for responsive images.
 * Expects -800w, -1200w etc. variants to exist in public/assets/images/.
 */
export function srcset(path: string, widths: number[]): string {
  const ext = path.substring(path.lastIndexOf('.'));
  const base = path.substring(0, path.lastIndexOf('.'));
  const parts = widths.map((w) => `${base}-${w}w${ext} ${w}w`);
  parts.push(`${path} ${widths[widths.length - 1]! * 2}w`);
  return parts.join(', ');
}

/** Same as srcset but for WebP (expects -600w.webp etc. from optimize-gallery-webp). */
export function srcsetWebp(path: string, widths: number[]): string {
  const base = path.substring(0, path.lastIndexOf('.'));
  return widths.map((w) => `${base}-${w}w.webp ${w}w`).join(', ');
}

/** Same as srcset but for AVIF. */
export function srcsetAvif(path: string, widths: number[]): string {
  const base = path.substring(0, path.lastIndexOf('.'));
  return widths.map((w) => `${base}-${w}w.avif ${w}w`).join(', ');
}

export const heroSrcset = (p: string) => srcset(p, [800, 1200]);
export const gallerySrcset = (p: string) => srcset(p, [600, 1200]);
export const singleWidthSrcset = (p: string, w: number) => srcset(p, [w]);
