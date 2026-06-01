import type { Locale } from '../i18n/index';

export type LHiverCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  subtitle: string;
  opening: string[];
  offersLabel: string;
  offers: { body: string[] }[];
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
    "Toile Blanche in winter. Four nights or more, one night offered; seven nights or more, two offered. November through March. Direct booking only.",
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
      body: [
        'Four nights or more, one offered.',
        'The right duration to stop counting days',
        'and simply be here.',
      ],
    },
    {
      body: [
        'Seven nights or more, two offered.',
        'A week, in the same suite throughout.',
        'The pace changes somewhere around day three.',
      ],
    },
  ],
  includesBoxLabel: 'Every winter offer includes',
  includesLines: [
    'Complimentary breakfast, always.',
    'Direct booking only. November through March.',
    'Offers are not valid during the weeks of Christmas and New Year.',
  ],
  cta: 'Check availability',
  closing:
    'The best version of Toile Blanche in winter is the one where you arrive with nothing urgent and leave with something you did not expect to find.',
  winterHintLabel: 'Winter offer available for your dates',
  winterHintBody:
    'Stay longer, pay less per night. Four nights or more with one night offered; seven nights or more with two.',
  winterHintLink: 'See winter offers →',
  galleryAriaLabel: 'Winter at Toile Blanche',
};

const fr: LHiverCopy = {
  metaTitle: "L'Hiver, Séjours hiver à Toile Blanche",
  metaDescription:
    'Toile Blanche en hiver. Quatre nuits ou plus, une nuit offerte ; sept nuits ou plus, deux offertes. Novembre à mars. Réservation directe uniquement.',
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
      body: [
        'Quatre nuits ou plus, une offerte.',
        'La durée idéale pour cesser de compter les jours',
        'et simplement être là.',
      ],
    },
    {
      body: [
        'Sept nuits ou plus, deux offertes.',
        'Une semaine, dans la même suite du début à la fin.',
        'Le rythme change vers le troisième jour.',
      ],
    },
  ],
  includesBoxLabel: 'Chaque offre hiver comprend',
  includesLines: [
    'Petit-déjeuner, toujours offert.',
    'Réservation directe uniquement. Novembre à mars.',
    'Les offres ne sont pas valables durant les semaines de Noël et du Nouvel An.',
  ],
  cta: 'Vérifier les disponibilités',
  closing:
    "La meilleure version de Toile Blanche en hiver, c'est celle où l'on arrive sans urgence et où l'on repart avec quelque chose que l'on n'attendait pas.",
  winterHintLabel: 'Une offre hiver est disponible pour vos dates',
  winterHintBody:
    'Prolongez votre séjour, réduisez le tarif par nuit. Quatre nuits ou plus avec une nuit offerte ; sept nuits ou plus avec deux.',
  winterHintLink: 'Voir les offres hiver →',
  galleryAriaLabel: "L\u2019hiver à Toile Blanche",
};

const byLocale: Record<Locale, LHiverCopy> = { en, fr };

export function getLHiverCopy(locale: Locale): LHiverCopy {
  return byLocale[locale];
}
