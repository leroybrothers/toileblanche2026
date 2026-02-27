import en from './en.json';
import fr from './fr.json';

const dictionaries = { en, fr } as const;

export type Locale = keyof typeof dictionaries;
export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'fr'];

export function useTranslations(locale: Locale = defaultLocale) {
  return dictionaries[locale];
}

export function getLocaleFromPath(path: string): Locale {
  const segment = path.split('/').filter(Boolean)[0];
  return locales.includes(segment as Locale) ? (segment as Locale) : defaultLocale;
}

export function localePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/fr${clean}`;
}

export function getAlternateUrls(path: string): { locale: Locale; href: string }[] {
  const base = 'https://www.toileblanche.com';
  const cleanPath = path.replace(/^\/fr/, '') || '/';
  return [
    { locale: 'en', href: `${base}${cleanPath}` },
    { locale: 'fr', href: `${base}/fr${cleanPath}` },
  ];
}
