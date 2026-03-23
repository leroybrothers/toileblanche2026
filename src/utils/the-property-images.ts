/**
 * Reads images from the-property cluster folders at build time.
 * Uses whatever filenames exist; order is alphabetical.
 * Layout adapts to actual count per cluster.
 */
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE = join(process.cwd(), 'public/assets/images/theproperty');
const IMG_EXT = /\.(jpg|jpeg|png|webp|avif)$/i;
const OPTIMIZED_VARIANT = /-\d+w\./i; // -600w, -800w, -1200w etc — exclude, use base only

function listImages(cluster: string): string[] {
  const dir = join(BASE, cluster);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => IMG_EXT.test(f) && !OPTIMIZED_VARIANT.test(f))
    .sort()
    .map((f) => `/assets/images/theproperty/${cluster}/${f}`);
}

const placeholders = {
  place: ['/assets/images/aboutgrid/StP25-ToileBlanche-c-GaelleSimon-21.jpg', '/assets/images/aboutgrid/IMG_2069.jpg', '/assets/images/aboutgrid/IMG_5950 (1).jpg', '/assets/images/aboutgrid/IMG_1902.jpg'],
  houses: ['/assets/images/art/IMG_0365.jpg', '/assets/images/pools/IMG_2711.jpg', '/assets/images/art/ervinck-1.jpg'],
  rooms: ['/assets/images/cabanat/gallery-4.jpg', '/assets/images/bronzette/gallery-2.jpg', '/assets/images/penequet/gallery-5.jpg', '/assets/images/suite-artiste/gallery-3.jpg', '/assets/images/art/artgallery/IMG_9658.jpg'],
  table: ['/assets/images/guinguette/IMG_7094.jpg', '/assets/images/restaurant/restaurantgallery/DSCF5723.JPG', '/assets/images/guinguette/DSCF0486.JPG', '/assets/images/restaurant/restaurantgallery/IMG_0597.jpg', '/assets/images/restaurant/food1.jpg', '/assets/images/restaurant/food2.jpg'],
  art: [
    '/assets/images/art/art10.JPG',
    '/assets/images/art/art11.jpg',
    '/assets/images/art/art12.jpg',
    '/assets/images/art/art13.jpg',
    '/assets/images/art/art14.JPG',
    '/assets/images/art/art15.JPG',
  ],
  pools: [
    '/assets/images/pools/IMG_2644.jpg',
    '/assets/images/pools/IMG_2979.jpg',
    '/assets/images/theproperty/thegarden/IMG_3421.jpg',
    '/assets/images/theproperty/thegarden/IMG_4379.jpg',
  ],
  garden: ['/assets/images/garden/garden1.jpg', '/assets/images/garden/garden2.jpg', '/assets/images/garden/garden5.jpg', '/assets/images/garden/garden6.jpg'],
  atmosphere: Array(10).fill('/assets/images/art/StP25-ToileBlanche-c-GaelleSimon-36.jpg'),
};

function orFallback<T>(arr: T[], fallback: T[]): T[] {
  return arr.length ? arr : fallback;
}

/** Returns raw file lists per cluster (for reporting). */
export function getPropertyImageInventory() {
  return {
    'the-place': listImages('theplace'),
    'the-houses': listImages('thehouses'),
    'the-rooms': listImages('therooms'),
    'the-table': listImages('thetable'),
    'the-art': listImages('theart'),
    'the-pools': listImages('thepools'),
    'the-garden': listImages('thegarden'),
    'the-atmosphere': listImages('theatmosphere'),
  };
}

export function getPropertyImages() {
  const place = orFallback(listImages('theplace'), placeholders.place);
  const houses = orFallback(listImages('thehouses'), placeholders.houses);
  const rooms = orFallback(listImages('therooms'), placeholders.rooms);
  const table = orFallback(listImages('thetable'), placeholders.table);
  const art = placeholders.art; // Explicit: art1–4 from images/art + TB Session 2 FXO 1 (excludes Aerts 4, IMG_3266)
  const pools = orFallback(listImages('thepools'), placeholders.pools);
  const garden = placeholders.garden; // Explicit: garden1, 2, 5, 6 (IMG_3421, IMG_4379 moved to pools)
  const atmosphere = orFallback(listImages('theatmosphere'), placeholders.atmosphere);

  return {
    // place: 1st=hero (or shared with page hero), rest=portraits. With 2: hero + 1 portrait.
    place: {
      hero: place[0]!,
      portraits: place.slice(1), // 1–3 images depending on count
    },
    // houses: 2 landscapes + fullbleed + extras. With 5: [0,1] landscapes, [2] fullbleed, [3,4] extra row.
    houses: {
      landscape1: houses[0]!,
      landscape2: houses[1]!,
      fullbleed: houses[2]!,
      extra: houses.slice(3),
    },
    // rooms/suites: 3 portraits + 3 landscapes (suites1–3 under).
    rooms: {
      portraits: rooms.slice(0, 3),
      landscapes: rooms.slice(3, 6),
    },
    // table: hero + portraits + 2 landscapes (food1, food2 from restaurant — always used).
    table: {
      hero: table[0]!,
      portraits: table.slice(1, 4),
      landscapes: ['/assets/images/restaurant/food1.jpg', '/assets/images/restaurant/food2.jpg'],
    },
    // art: 6 portraits (art10–art15), 3 per row, same ratio.
    art: {
      portraits: art,
    },
    // pools: 4 landscapes (IMG_3421, IMG_4379 moved from garden).
    pools: {
      landscape1: pools[0]!,
      landscape2: pools[1]!,
      all: pools,
    },
    // garden: all images in middle row. With 6: garden1–garden6.
    garden: {
      hero: garden[0]!,
      middle: garden,
      fullbleed: (garden[3] ?? garden[2] ?? garden[1] ?? garden[0])!,
    },
    // atmosphere: 10 images — 1st=hero, text, then 9 in a 3×3 grid
    atmosphere: {
      hero: atmosphere[0]!,
      grid: atmosphere.slice(1),
    },
  };
}
