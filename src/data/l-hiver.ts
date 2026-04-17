import type { Locale } from '../i18n/index';

export type LHiverCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  subtitle: string;
  opening: string[];
  offersLabel: string;
  offers: { title: string; body: string[] }[];
  includesBoxLabel: string;
  includesLines: string[];
  cta: string;
  closing: string;
  winterHintLabel: string;
  winterHintBody: string;
  winterHintLink: string;
  galleryAriaLabel: string;
};

const en: LHiverCopy = {
  metaTitle: "L'Hiver, Winter Stays at Toile Blanche",
  metaDescription:
    "Toile Blanche in winter. Longer stays, one or two nights offered. From three nights with one offered to a full week. November through March. Direct booking only.",
  eyebrow: 'Toile Blanche, Saint-Paul-de-Vence',
  h1: "L'Hiver",
  subtitle: 'Toile Blanche in its quietest, most itself season',
  opening: [
    'The village in January belongs to the people who live in it. The foundations are open and unhurried. The table at Le Restaurant easier to find. The light is lower and more interesting. The mistral, when it comes, clears everything.',
    'Toile Blanche in winter is not a compromise. For the guest who knows what to do with a quiet place, it is the point.',
    'The longer you stay, the more the season makes sense.',
  ],
  offersLabel: 'Winter stays',
  offers: [
    {
      title: 'Three nights, one offered',
      body: [
        'Book three nights and the fourth is ours to offer.',
        'An extra morning. A slower departure.',
      ],
    },
    {
      title: 'Four nights, one offered',
      body: [
        'Book four nights and the fifth is ours to offer.',
        'Five nights is the right duration, enough to stop counting days and simply be here.',
      ],
    },
    {
      title: 'Five nights, two offered',
      body: [
        'Book five nights and the sixth and seventh are ours to offer.',
        'A week. Worth the extra days.',
      ],
    },
    {
      title: 'Seven nights',
      body: [
        'A week, in the same suite throughout.',
        'The pace changes somewhere around day three.',
        'That is when the stay becomes something other than a holiday.',
      ],
    },
  ],
  includesBoxLabel: 'Every winter offer includes',
  includesLines: [
    'Breakfast, always included.',
    'Direct booking only. November through March.',
    'Offers are not valid during the weeks of Christmas and New Year.',
  ],
  cta: 'Check availability',
  closing:
    'The best version of Toile Blanche in winter is the one where you arrive with nothing urgent and leave with something you did not expect to find.',
  winterHintLabel: 'Winter offer available for your dates',
  winterHintBody:
    'Stay longer, pay less per night. From three nights with one night offered, to seven nights with the full week advantage.',
  winterHintLink: 'See winter offers →',
  galleryAriaLabel: 'Winter at Toile Blanche',
};

const fr: LHiverCopy = {
  metaTitle: "L'Hiver, Séjours hiver à Toile Blanche",
  metaDescription:
    'Toile Blanche en hiver. Séjours prolongés, une ou deux nuits offertes. De trois nuits avec une offerte à une semaine complète. Novembre à mars. Réservation directe uniquement.',
  eyebrow: 'Toile Blanche, Saint-Paul-de-Vence',
  h1: "L'Hiver",
  subtitle: 'Toile Blanche dans sa saison la plus calme, la plus elle-même',
  opening: [
    'En janvier, le village appartient à ceux qui y vivent. Les fondations sont ouvertes et tranquilles. La table au Restaurant plus facile à trouver. La lumière est plus basse et plus intéressante. Le mistral, quand il passe, nettoie tout.',
    "Toile Blanche en hiver n'est pas un compromis. Pour l'hôte qui sait quoi faire d'un lieu calme, c'est précisément le but.",
    'Plus le séjour est long, plus la saison prend son sens.',
  ],
  offersLabel: 'Séjours hiver',
  offers: [
    {
      title: 'Trois nuits, une offerte',
      body: [
        'Réservez trois nuits et la quatrième est offerte.',
        'Une matinée de plus. Un départ sans hâte.',
      ],
    },
    {
      title: 'Quatre nuits, une offerte',
      body: [
        'Réservez quatre nuits et la cinquième est offerte.',
        "Cinq nuits, c'est la bonne durée, assez pour cesser de compter les jours et simplement être là.",
      ],
    },
    {
      title: 'Cinq nuits, deux offertes',
      body: [
        'Réservez cinq nuits et la sixième et septième sont offertes.',
        'Une semaine. Les jours supplémentaires valent la peine.',
      ],
    },
    {
      title: 'Sept nuits',
      body: [
        'Une semaine, dans la même suite du début à la fin.',
        'Le rythme change vers le troisième jour.',
        "C'est là que le séjour devient autre chose qu'un voyage.",
      ],
    },
  ],
  includesBoxLabel: 'Chaque offre hiver comprend',
  includesLines: [
    'Petit-déjeuner, toujours inclus.',
    'Réservation directe uniquement. Novembre à mars.',
    'Les offres ne sont pas valables durant les semaines de Noël et du Nouvel An.',
  ],
  cta: 'Vérifier les disponibilités',
  closing:
    "La meilleure version de Toile Blanche en hiver, c'est celle où l'on arrive sans urgence et où l'on repart avec quelque chose que l'on n'attendait pas.",
  winterHintLabel: 'Une offre hiver est disponible pour vos dates',
  winterHintBody:
    "Prolongez votre séjour, réduisez le tarif par nuit. À partir de trois nuits avec une nuit offerte, jusqu'à sept nuits avec l'avantage semaine complète.",
  winterHintLink: 'Voir les offres hiver →',
  galleryAriaLabel: "L\u2019hiver à Toile Blanche",
};

const byLocale: Record<Locale, LHiverCopy> = { en, fr };

export function getLHiverCopy(locale: Locale): LHiverCopy {
  return byLocale[locale];
}
