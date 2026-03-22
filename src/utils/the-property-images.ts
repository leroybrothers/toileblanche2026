/**
 * Reads images from the-property cluster folders at build time.
 * Uses whatever filenames exist; order is alphabetical.
 * Layout adapts to actual count per cluster.
 */
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE = join(process.cwd(), 'public/assets/images/theproperty');
const IMG_EXT = /\.(jpg|jpeg|png|webp|avif)$/i;

function listImages(cluster: string): string[] {
  const dir = join(BASE, cluster);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => IMG_EXT.test(f))
    .sort()
    .map((f) => `/assets/images/theproperty/${cluster}/${f}`);
}

const placeholders = {
  place: ['/assets/images/aboutgrid/StP25-ToileBlanche-c-GaelleSimon-21.jpg', '/assets/images/aboutgrid/IMG_2069.jpg', '/assets/images/aboutgrid/IMG_5950 (1).jpg', '/assets/images/aboutgrid/IMG_1902.jpg'],
  houses: ['/assets/images/art/IMG_0365.jpg', '/assets/images/pools/IMG_2711.jpg', '/assets/images/art/ervinck-1.jpg'],
  rooms: ['/assets/images/cabanat/gallery-4.jpg', '/assets/images/bronzette/gallery-2.jpg', '/assets/images/penequet/gallery-5.jpg', '/assets/images/suite-artiste/gallery-3.jpg', '/assets/images/art/artgallery/IMG_9658.jpg'],
  table: ['/assets/images/guinguette/IMG_7094.jpg', '/assets/images/restaurant/restaurantgallery/DSCF5723.JPG', '/assets/images/guinguette/DSCF0486.JPG', '/assets/images/restaurant/restaurantgallery/IMG_0597.jpg'],
  art: ['/assets/images/art/artgallery/StP25-ToileBlanche-c-GaelleSimon-8.jpg', '/assets/images/art/IMG_0365.jpg', '/assets/images/art/StP25-ToileBlanche-c-GaelleSimon-36.jpg'],
  garden: ['/assets/images/aboutgrid/IMG_5950 (1).jpg', '/assets/images/art/artgallery/IMG_9658.jpg'],
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
    'the-garden': listImages('thegarden'),
    'the-atmosphere': listImages('theatmosphere'),
  };
}

export function getPropertyImages() {
  const place = orFallback(listImages('theplace'), placeholders.place);
  const houses = orFallback(listImages('thehouses'), placeholders.houses);
  const rooms = orFallback(listImages('therooms'), placeholders.rooms);
  const table = orFallback(listImages('thetable'), placeholders.table);
  const art = orFallback(listImages('theart'), placeholders.art);
  const garden = orFallback(listImages('thegarden'), placeholders.garden);
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
    // rooms: 3 portraits + 2 landscapes. With 3: portraits only.
    rooms: {
      portraits: rooms.slice(0, 3),
      landscapes: rooms.slice(3, 5),
    },
    // table: hero + portraits. With 3: hero + 2 portraits.
    table: {
      hero: table[0]!,
      portraits: table.slice(1),
    },
    // art: 2 landscapes + fullbleed. With 3: perfect.
    art: {
      landscape1: art[0]!,
      landscape2: art[1]!,
      fullbleed: art[2]!,
    },
    // garden: hero + middle row + fullbleed. With 4: hero, [1,2] middle, [3] fullbleed. With 3: hero, [1] middle, [2] fullbleed. With 2: hero, fullbleed only.
    garden: {
      hero: garden[0]!,
      middle: garden.length >= 4 ? garden.slice(1, 3) : garden.length === 3 ? garden.slice(1, 2) : [],
      fullbleed: (garden[3] ?? garden[2] ?? garden[1] ?? garden[0])!,
    },
    // atmosphere: 10 images — 1st=hero, text, then 9 in a 3×3 grid
    atmosphere: {
      hero: atmosphere[0]!,
      grid: atmosphere.slice(1),
    },
  };
}
