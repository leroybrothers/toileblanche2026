/**
 * Shared image optimization config.
 * Use consistent quality and resize settings across all scripts for sharp output.
 *
 * Sharpness issues addressed:
 * - fastShrinkOnLoad: false — avoids JPEG shrink-on-load which can cause moiré/softness
 * - kernel: lanczos3 — best downscale quality (Sharp default)
 * - Light sharpen after resize — compensates for blur introduced by downsampling
 */

export const RESIZE_OPTS = {
  withoutEnlargement: true,
  fastShrinkOnLoad: false, // Full-quality resize; true can cause moiré/softness on JPEG
  kernel: 'lanczos3',
};

/** Light sharpen after resize to restore edge clarity. sigma 0.6 is subtle. */
export const SHARPEN_OPTS = { sigma: 0.6 };

/** Quality levels (JPEG 82–88 range was causing softness; standardize higher) */
export const QUALITY = {
  jpeg: 90,
  webp: 88,
  avif: 72,
};

/** For scripts that prefer lower file size (archive, compress) */
export const QUALITY_COMPACT = {
  jpeg: 86,
};

/** Second-pass / heavy assets — smaller files, acceptable on web (pass 2 only) */
export const QUALITY_TIGHT = {
  jpeg: 82,
};
