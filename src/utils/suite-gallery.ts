/**
 * Suite gallery ordering: bed → interior → bathroom → exterior.
 * Uses src/data/suite-gallery-categories.json to map image paths to categories.
 * Edit that file to adjust which photos appear in which order.
 */

import categoriesData from '../data/suite-gallery-categories.json';

const CATEGORY_ORDER = ['bed', 'interior', 'bathroom', 'exterior'] as const;
type Category = (typeof CATEGORY_ORDER)[number];

const categoriesMap = { ...categoriesData } as Record<string, Record<string, Category>>;
delete (categoriesMap as Record<string, unknown>)._comment;

function getCategoryOrder(cat: Category | undefined): number {
  if (!cat) return 1; // unknown = interior
  const i = CATEGORY_ORDER.indexOf(cat);
  return i >= 0 ? i : 1;
}

/**
 * Sorts gallery images for a suite by category: bed, interior, bathroom, exterior.
 * Falls back to original order if no categories are defined for the suite.
 */
export function sortGalleryByCategory(
  slug: string,
  gallery: string[]
): string[] {
  const suiteCats = categoriesMap[slug];
  if (!suiteCats || Object.keys(suiteCats).length === 0) {
    return gallery;
  }

  return [...gallery].sort((a, b) => {
    const catA = suiteCats[a] ?? suiteCats[a.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '.JPG')];
    const catB = suiteCats[b] ?? suiteCats[b.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '.JPG')];
    const orderA = getCategoryOrder(catA);
    const orderB = getCategoryOrder(catB);
    if (orderA !== orderB) return orderA - orderB;
    // Same category: preserve original order
    return gallery.indexOf(a) - gallery.indexOf(b);
  });
}
