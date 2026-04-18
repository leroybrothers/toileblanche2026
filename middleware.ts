import { next, rewrite } from '@vercel/functions';

const SEMINAIRE_HOST = 'leseminaire.toileblanche.com';

/** Only run on root HTML requests; avoids overhead on assets. */
export const config = {
  matcher: ['/', '/index.html'],
};

/**
 * Vercel serves /index.html before vercel.json rewrites, so host-based
 * “/ → /seminaire” must happen here (runs before static file routing).
 */
export default function middleware(request: Request) {
  const url = new URL(request.url);
  if (url.hostname !== SEMINAIRE_HOST) {
    return next();
  }
  if (url.pathname === '/' || url.pathname === '/index.html') {
    return rewrite(new URL('/seminaire/', request.url));
  }
  return next();
}
