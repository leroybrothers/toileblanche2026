import type { Locale } from '../i18n/index';

/** Long-form La Vie Ici page; `namesBelowPortrait` = names in figcaption under portrait vs. paragraph above. */
export type LaVieIciStrings = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  subtitle: string;
  openingLead: string;
  openingParagraphs: string[];
  familyParagraphs: string[];
  namesLine: string;
  namesBelowPortrait: boolean;
  bridgeParagraphs: string[];
  radart: {
    label: string;
    paragraphs: string[];
    linkText: string;
  };
  semaine: {
    meta: string;
    bodyParagraphs: string[];
    includesLabel: string;
    includes: string[];
    structuredMoment: { title: string; paragraphs: string[] };
    seasonStanzas: { heading: string; paragraphs: string[] }[];
    rate: string;
    cta: string;
    mailSubject: string;
  };
  atelier: {
    meta: string;
    lede: string;
    body1: string;
    body2: string;
    body3: string;
    body4: string;
    body5: string;
    accessLabel: string;
    accessValue: string;
    accessNote: string;
    rate: string;
    cta: string;
    mailSubject: string;
  };
  vignes: {
    meta: string;
    bodyParagraphs: string[];
    daysLabel: string;
    dayBlocks: { heading: string; paragraphs: string[] }[];
    rate: string;
    cta: string;
    mailSubject: string;
  };
  sessions: {
    meta: string;
    title: string;
    lede: string;
    bodyParagraphs: string[];
    linkText: string;
  };
  artiste: {
    meta: string;
    lede: string;
    body1: string;
    body2: string;
    body3: string;
    accessLabel: string;
    accessValue: string;
    accessNote: string;
  };
  ecrivain: {
    meta: string;
    lede: string;
    body1: string;
    body2: string;
    body3: string;
    body4: string;
    body5: string;
    accessLabel: string;
    accessValue: string;
    accessNote: string;
  };
  closing: {
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    contactLabel: string;
    contactTitle: string;
    contactP1: string;
    contactP2: string;
  };
};

const en: LaVieIciStrings = {
  metaTitle: 'La Vie Ici | Toile Blanche | Saint-Paul de Vence',
  metaDescription:
    "Life at Toile Blanche across every season. La Semaine, L\u2019Atelier, Vignes Vivantes, Toile Blanche Sessions, and more.",
  eyebrow: 'Toile Blanche, Saint Paul de Vence',
  subtitle: 'Life at Toile Blanche, across every season',
  openingLead: 'La Vie Ici,',
  openingParagraphs: [
    'La Vie Ici is not defined as programming.',
    'It follows neither a strict calendar nor an events-industry logic.',
    'It unfolds in a more organic rhythm, tied to the seasons, to who is present, and to a particular idea of hospitality.',
    'Toile Blanche offers a range of formats — stays, residencies, and gatherings — that share one intention: to live well, in a place conceived and built with care.',
  ],
  familyParagraphs: [
    'For nearly two centuries, the mas where it all began has stood here, rooted in Saint-Paul-de-Vence.',
    'In 1999, Nadine and Dany found it. They did not come to change it, but to reveal what it already was. Three rooms opened, simply. A home, before anything else.',
    'Their sons, Gregory, Gilles, and Nicolas, grew up between Belgium and Provence. They are artists. They saw the world. Then they came back. They are known as the Leroy Brothers.',
    'Slowly, the place evolved. Without rupture. Without losing itself. A place to live, open and essential. A family. A home. A work of art that is lived in.',
  ],
  namesLine:
    'Nadine · Dany · Gregory · Gilles · Nicolas · Caroline · Tahnee · Alexis · Agathe · Marius · Isaac',
  namesBelowPortrait: true,
  bridgeParagraphs: [
    'What follows is not a programme.',
    'It is the life of a place, across seasons, presences, silences, and shared moments.',
    'Some things can be booked. Others reveal themselves through conversation. Others come only by invitation.',
    'Whatever brings you here, you are welcome, not as a spectator, but as someone who was there.',
  ],
  radart: {
    label: 'The cultural circuit',
    paragraphs: [
      'Saint-Paul-de-Vence holds an unusual concentration of contemporary art. Foundations, galleries, independent spaces, a circuit you can walk in forty-five minutes, simply.',
      'In 2026, the Leroy Brothers created RAD/ART, Rendez-Vous Actuel d\u2019Art. A living guide. Exhibitions, openings, and the moments that mark the life of the village across the year.',
      'Every guest at Toile Blanche has access to it. A way of finding your bearings, without anything being imposed.',
    ],
    linkText: 'radart.net',
  },
  semaine: {
    meta: 'Four times a year · spring · summer · autumn · winter',
    bodyParagraphs: [
      'Four times a year, spring, summer, autumn, winter, the Leroy Brothers welcome a small number of guests. Collectors, amateurs, artists, attentive travellers. Five days, at their own pace.',
      'You arrive on Wednesday. You leave on Sunday. Your own suite. Time.',
      'One evening, the Leroy Brothers share the table with their guests. Nothing is imposed in a house conceived as a work of art from its very first day.',
    ],
    includesLabel: 'What La Semaine includes',
    includes: [
      'Breakfast, every morning.',
      'Served at table, at your time.',
      'Discovery of the place and its collection. A RAD/ART gallery walk in the village.',
      'Organised visits: Fondation Maeght, Fondation CAB, Arik Levy sculpture park. A few galleries. At your own pace.',
      'One evening, a longer table for dinner with the Leroy Brothers and other guests.',
    ],
    structuredMoment: {
      title: 'The one structured moment',
      paragraphs: [
        'A conversation with the Leroy Brothers.',
        'Arranged during the week, for the group. Around forty-five minutes. Never announced in advance.',
        'Not a guided tour, a conversation about what is being made, and why.',
      ],
    },
    seasonStanzas: [
      {
        heading: 'Spring, April, May',
        paragraphs: [
          'Toile Blanche wakes. After Art Basel Hong Kong, the return to Europe.',
          'You arrive open. Ready to look at things slowly.',
        ],
      },
      {
        heading: 'Summer, late June, July',
        paragraphs: [
          'La Semaine settles into the season. It does not interrupt it.',
          'It finds its place at the heart of summer.',
        ],
      },
      {
        heading: 'Autumn, October, November',
        paragraphs: [
          'After the fairs. After seeing too much, too quickly.',
          'You arrive saturated. You leave with a sharper eye.',
        ],
      },
      {
        heading: 'Winter, January, February',
        paragraphs: [
          'Toile Blanche draws inward. Quieter, more intimate.',
          'For those who know, it is the most honest time, the most intense.',
          'And spring comes again.',
        ],
      },
    ],
    rate: 'Rate: From €4,000 per suite, five nights, inclusive. Direct booking only.',
    cta: 'Write to us about La Semaine',
    mailSubject: 'Enquiry: La Semaine',
  },
  atelier: {
    meta: 'November through March, long stay, by arrangement',
    lede: 'A long stay, made for work.',
    body1:
      'Between November and March, when the season fades, Toile Blanche opens its doors to a small number of guests.',
    body2:
      'Writers, architects, composers, curators. Each arrives with a project, a need for silence, beauty, and time.',
    body3:
      'L\u2019Atelier is a long stay, two weeks minimum, in the same suite throughout.',
    body4: 'Breakfast. The restaurant.',
    body5:
      'The Leroy Brothers are here, engaged in their own work. The proximity is real, in shared moments, in conversations that emerge without ever being arranged.',
    accessLabel: 'Two moments',
    accessValue: 'Arrival. A conversation mid-stay.',
    accessNote:
      'A brief exchange about what you are working on and what you need the stay to provide. The second is optional. Some take it. Many do not. Both are the right answer.',
    rate: 'Minimum two weeks, same suite throughout · From €2,500 per suite per week, inclusive · Direct booking only',
    cta: "Enquire about L\u2019Atelier",
    mailSubject: "Enquiry: L\u2019Atelier",
  },
  vignes: {
    meta: 'Twice yearly, February and November',
    bodyParagraphs: [
      'Twice a year, Isabelle Legeron MW, founder of RAW WINE and one of the most respected voices in natural wine, comes to Toile Blanche for four days.',
      'She brings wines that are alive. Not a selection, but a vision.',
      'The bottles open slowly. So do the conversations.',
      'For four days, wine moves, between glasses, around the table, in the light of the place.',
      'Moments to taste. A dinner that extends. A morning in the vines, with the people who work the land.',
      'Nothing didactic. Nothing to prove.',
      'Only a shared attention, to gesture, to time, to what is made with conviction.',
      'At Toile Blanche, wine is not a subject. It is a way of seeing.',
    ],
    daysLabel: 'The four days',
    dayBlocks: [
      {
        heading: 'Thursday evening',
        paragraphs: [
          'Arrival. A first glass.',
          'A simple moment, informal. Time to settle.',
        ],
      },
      {
        heading: 'Friday, Session I',
        paragraphs: [
          'A tasting built around a question, never around an origin.',
          'In the evening, dinner at Le Restaurant. The conversation continues, naturally, at the table.',
        ],
      },
      {
        heading: 'Saturday, Session II',
        paragraphs: [
          'Morning, the vines. With a producer Isabelle knows.',
          'Not a cellar visit. A presence, in the vineyard. A conversation, in the middle of the landscape.',
          'In the evening, a long table. Everyone together. The Brothers are there.',
        ],
      },
      {
        heading: 'Sunday, Session III',
        paragraphs: [
          'Four wines revisited with renewed attention. Tasted again, differently.',
          'Lunch at La Guinguette. Then a departure, reluctantly.',
        ],
      },
    ],
    rate: 'Four nights, Thursday to Sunday · From €3,500 per suite, inclusive of all sessions and Saturday dinner · Eight guests maximum',
    cta: 'Enquire about Vignes Vivantes',
    mailSubject: 'Enquiry: Vignes Vivantes',
  },
  sessions: {
    meta: 'Several times a year, open to all',
    title: 'Les Sessions',
    lede: 'Art, music.',
    bodyParagraphs: [
      'Several times a year, in spring, in summer, at the moment when the seasons shift, Toile Blanche opens wider.',
      'The circles expand.',
      'Artists, musicians, neighbours, collectors, friends, strangers passing through, presences mix without hierarchy.',
      'An afternoon that slides into evening. A work that appears. A musician who plays. A table that lengthens. You arrive, you move through, you stay. Conversations begin, cross, continue elsewhere.',
      'Les Sessions began in 2024. It is the most open thing we do. The most free, also.',
    ],
    linkText: 'Dates and upcoming sessions at toileblanchecontemporary.com',
  },
  artiste: {
    meta: 'Once a year, January or February',
    lede: 'One artist. One month. One work that stays.',
    body1: 'Each winter, the Leroy Brothers invite one artist to come to Toile Blanche for a month.',
    body2:
      'The artist has full use of Toile Blanche. They work as they need to work, in the suite, in the grounds, in the studio by arrangement. The Brothers are present but not directive. The relationship develops as it develops.',
    body3:
      'At the end of the stay, one work enters the permanent collection. It is installed and it remains. Future guests encounter it without being told its story, until they ask. The asking is the beginning of the conversation the invitation set in motion months earlier.',
    accessLabel: 'How it works',
    accessValue: 'A personal invitation, not an open call',
    accessNote:
      "L\u2019Artiste Invité has no application process and no jury. It is an invitation extended by artists to an artist, once a year, in winter. The work that results is a consequence of the stay, not a deliverable.",
  },
  ecrivain: {
    meta: 'Each winter, November through March',
    lede: 'A writer in residence.',
    body1:
      'In winter, someone arrives. Not to teach. Not to produce anything defined. To write.',
    body2:
      'In a suite, a few days, sometimes two weeks. Time ahead. The light, the silence. Toile Blanche does not intervene.',
    body3: 'The form matters little. Novel, essay, criticism, film.',
    body4:
      'What matters is the relationship to language. Strong enough that others want to be near it.',
    body5: 'The evening decides.',
    accessLabel: 'How it works',
    accessValue: 'An invitation. No application. No announcement.',
    accessNote: 'This is not a programme. It is an opening.',
  },
  closing: {
    p1: 'Some come once and carry the place with them. Others return until everything feels familiar. With time, a few simply become part of it. We have a name for each, though we rarely use them out loud.',
    p2: 'Some guests come to Toile Blanche in winter with no intention of joining anything. They come because the village is quieter, the foundations less crowded, the table at Le Restaurant easier to find. Because they have spent a lifetime building a relationship with culture and they know that its best version happens slowly, without a programme, in a place that understands what they are looking for.',
    p3: 'For those guests, La Vie Ici is simply the reason to come in November rather than July. The rest takes care of itself.',
    p4: 'La Vie Ici is not a calendar of events.',
    contactLabel: 'For any enquiry',
    contactTitle: 'Write to us.',
    contactP1:
      'For La Semaine, L\u2019Atelier, and Vignes Vivantes,\ntell us the programme, the season,\nand how many people.\nWe reply within 48 hours.',
    contactP2:
      'For L\u2019Artiste and L\u2019Écrivain,\nby invitation only.\nIf someone seems right for it,\nyou are welcome to write to us about them.',
  },
};

const fr: LaVieIciStrings = {
  metaTitle: 'La Vie Ici | Toile Blanche | Saint-Paul-de-Vence',
  metaDescription:
    "La vie à Toile Blanche à travers chaque saison. La Semaine, L\u2019Atelier, Vignes Vivantes, Toile Blanche Sessions, et plus encore.",
  eyebrow: 'Toile Blanche, Saint-Paul-de-Vence',
  subtitle: 'La vie à Toile Blanche, à travers chaque saison',
  openingLead: 'La Vie Ici,',
  openingParagraphs: [
    'La Vie Ici ne se définit pas comme une programmation.',
    'Elle ne suit ni calendrier strict, ni logique événementielle.',
    'Elle s\u2019inscrit dans un rythme plus organique, lié aux saisons, aux présences et à une certaine idée de l\u2019hospitalité.',
    'Toile Blanche propose une série de formats, séjours, résidences, rencontres, qui ont en commun une même intention : bien vivre, dans un lieu pensé et construit avec exigence.',
  ],
  familyParagraphs: [
    'Depuis près de deux siècles, le mas où tout a commencé est là, ancré à Saint-Paul-de-Vence.',
    'En 1999, Nadine et Dany le découvrent. Ils ne cherchent pas à le transformer, mais à révéler ce qu\u2019il est déjà. Trois chambres s\u2019ouvrent, simplement. Une maison, avant tout.',
    'Leurs fils, Gregory, Gilles et Nicolas, grandissent entre la Belgique et la Provence. Ils sont artistes. Découvrent le monde. Puis ils reviennent. On les connaît comme les Leroy Brothers.',
    'Peu à peu, le lieu évolue. Sans rupture. Avec justesse. Un lieu de vie, ouvert, essentiel. Une famille. Une maison. Une \u0153uvre d\u2019art habitée.',
  ],
  namesLine:
    'Nadine · Dany · Gregory · Gilles · Nicolas · Caroline · Tahnee · Alexis · Agathe · Marius · Isaac',
  namesBelowPortrait: true,
  bridgeParagraphs: [
    'Ce qui suit n\u2019est pas un programme.',
    'C\u2019est la vie d\u2019un lieu, au fil des saisons, des présences, des silences, des moments partagés.',
    'Certaines choses se réservent. D\u2019autres se découvrent au fil d\u2019une conversation. D\u2019autres ne viennent que par invitation.',
    'Quelle que soit la raison qui vous amène, vous êtes les bienvenus ici, non pas en spectateur, mais comme quelqu\u2019un qui était là.',
  ],
  radart: {
    label: 'Le parcours culturel',
    paragraphs: [
      'Saint-Paul-de-Vence concentre différents lieux d\u2019art contemporain. Fondations, galeries, ateliers, un parcours que l\u2019on traverse à pied.',
      'En 2026, les Leroy Brothers créent RAD/ART, Rendez-Vous Actuel d\u2019Art. Un guide vivant. Des expositions, des vernissages, des moments qui rythment la vie du village au fil de l\u2019année.',
      'Chaque hôte de Toile Blanche y a accès. Une manière de se repérer dans le village, sans jamais s\u2019imposer.',
    ],
    linkText: 'radart.net',
  },
  semaine: {
    meta: 'Quatre fois par an · printemps · été · automne · hiver',
    bodyParagraphs: [
      'Quatre fois par an, printemps, été, automne, hiver, les Leroy Brothers accueillent un petit nombre d\u2019hôtes. Collectionneurs, amateurs, artistes, voyageurs attentifs. Cinq jours, à leur rythme.',
      'On arrive le mercredi. On repart le dimanche. Une suite à soi. Du temps.',
      'Un soir, les Leroy Brothers partagent la table avec leurs invités. Rien n\u2019est imposé dans cette maison pensée comme une \u0153uvre depuis le premier jour.',
    ],
    includesLabel: 'Ce que comprend la semaine',
    includes: [
      'Le petit-déjeuner, chaque matin.',
      'Servi à table, à votre heure.',
      'Découverte du lieu et de sa collection. Un parcours de galeries RAD/ART au village.',
      'Des visites organisées, Fondation Maeght, Fondation CAB, Arik Levy parc de sculpture. Quelques galeries. À votre rythme.',
      'Un soir, une table plus longue pour le dîner avec les Leroy Brothers et d\u2019autres convives.',
    ],
    structuredMoment: {
      title: 'Le moment structuré',
      paragraphs: [
        'Une conversation avec les Leroy Brothers.',
        'Un arrangement dans la semaine, pour le groupe. Quarante-cinq minutes, environ. Jamais annoncé.',
        'Pas une visite guidée, une conversation sur ce qui se fait, et le \u201cpourquoi\u201d.',
      ],
    },
    seasonStanzas: [
      {
        heading: 'Printemps, avril, mai',
        paragraphs: [
          'Toile Blanche s\u2019éveille. Après Art Basel Hong Kong, retour en Europe.',
          'On arrive disponible. Prêt à regarder, lentement.',
        ],
      },
      {
        heading: 'Été, fin juin, juillet',
        paragraphs: [
          'La Semaine s\u2019inscrit dans la saison. Elle ne l\u2019interrompt pas.',
          'Elle trouve sa place au c\u0153ur de l\u2019été.',
        ],
      },
      {
        heading: 'Automne, octobre, novembre',
        paragraphs: [
          'Après les foires. Après avoir trop vu, trop vite.',
          'On arrive saturé. On repart le regard affûté.',
        ],
      },
      {
        heading: 'Hiver, janvier, février',
        paragraphs: [
          'Toile Blanche se resserre. Plus silencieux, plus intime.',
          'Pour les initiés, c\u2019est le moment le plus juste, le plus intense.',
          'Et le printemps revient.',
        ],
      },
    ],
    rate: 'Tarif : À partir de 4 000 € par suite, cinq nuits, tout compris. Réservation directe uniquement.',
    cta: 'Nous écrire au sujet de La Semaine',
    mailSubject: 'Demande : La Semaine',
  },
  atelier: {
    meta: 'Novembre à mars, long séjour, sur demande',
    lede: 'Un long séjour, pensé pour le travail ou la détente.',
    body1:
      'Entre novembre et mars, lorsque la saison s\u2019efface, Toile Blanche ouvre ses portes à un petit nombre d\u2019hôtes.',
    body2:
      'Écrivains, architectes, compositeurs, commissaires. Chacun vient avec un projet, un besoin de silence, de beauté et de temps.',
    body3:
      'L\u2019Atelier se vit en séjour prolongé, deux semaines au minimum, dans la même suite, du début à la fin.',
    body4: 'Le petit-déjeuner. Le restaurant.',
    body5:
      'Les Leroy Brothers sont présents, engagés dans leur propre travail. La proximité existe, dans les moments partagés, les conversations qui émergent sans jamais être organisées.',
    accessLabel: 'Deux moments',
    accessValue: 'L\u2019accueil à l\u2019arrivée. Un échange à mi-séjour.',
    accessNote:
      'Un bref échange sur ce que vous travaillez et ce que vous attendez du séjour. Le second est une option. Certains le saisissent. Beaucoup ne le font pas. Les deux sont la bonne réponse.',
    rate: 'Deux semaines minimum, même suite tout au long · À partir de 2 500 € par suite par semaine, tout compris · Réservation directe uniquement',
    cta: 'Nous écrire au sujet de L\u2019Atelier',
    mailSubject: "Demande : L\u2019Atelier",
  },
  vignes: {
    meta: 'Deux fois par an, février et novembre',
    bodyParagraphs: [
      'Deux fois par an, Isabelle Legeron MW, fondatrice de RAW WINE et figure majeure du vin naturel, rejoint Toile Blanche pour quatre jours.',
      'Elle apporte des vins vivants. Pas une sélection, mais une vision.',
      'Les bouteilles s\u2019ouvrent lentement. Les conversations aussi.',
      'Pendant quatre jours, le vin circule, entre les verres, autour de la table, dans la lumière du lieu.',
      'Des moments pour goûter. Un dîner qui s\u2019étire. Une matinée dans les vignes, au contact direct de ceux qui travaillent la terre.',
      'Rien de didactique. Rien à prouver.',
      'Seulement une attention partagée, au geste, au temps, à ce qui est fait avec conviction.',
      'À Toile Blanche, le vin n\u2019est pas un sujet. C\u2019est une manière de voir.',
    ],
    daysLabel: 'Les quatre jours',
    dayBlocks: [
      {
        heading: 'Jeudi soir',
        paragraphs: [
          'Arrivée. Un premier verre.',
          'Un moment simple, informel. Le temps de se poser.',
        ],
      },
      {
        heading: 'Vendredi, Session I',
        paragraphs: [
          'Une dégustation construite autour d\u2019une question, jamais autour d\u2019une origine.',
          'Le soir, dîner au restaurant. La conversation se prolonge, naturellement, à table.',
        ],
      },
      {
        heading: 'Samedi, Session II',
        paragraphs: [
          'Le matin, les vignes. Avec un producteur qu\u2019Isabelle connaît.',
          'Pas une visite de cave. Une présence, dans la vigne. Un échange, au milieu du paysage.',
          'Le soir, une longue table. Tous réunis. Les Brothers sont là.',
        ],
      },
      {
        heading: 'Dimanche, Session III',
        paragraphs: [
          'Quatre vins retrouvés avec une attention renouvelée. Goûtés à nouveau, autrement.',
          'Déjeuner à La Guinguette. Puis un départ à contrec\u0153ur.',
        ],
      },
    ],
    rate: 'Quatre nuits, du jeudi au dimanche · À partir de 3 500 € par suite, toutes sessions et dîner du samedi inclus · Huit hôtes maximum',
    cta: 'Nous écrire au sujet de Vignes Vivantes',
    mailSubject: 'Demande : Vignes Vivantes',
  },
  sessions: {
    meta: 'Plusieurs fois par an, ouvert à tous',
    title: 'Les Sessions',
    lede: 'Art, musique.',
    bodyParagraphs: [
      'Plusieurs fois par an, au printemps, en été, au moment où les saisons basculent, Toile Blanche s\u2019ouvre davantage.',
      'Les cercles s\u2019élargissent.',
      'Artistes, musiciens, voisins, collectionneurs, amis, inconnus de passage, les présences se mêlent, sans hiérarchie.',
      'Un après-midi qui glisse vers le soir. Une \u0153uvre qui apparaît. Un musicien qui joue. Une table qui s\u2019allonge. On arrive, on circule, on reste. Les conversations commencent, se croisent, se prolongent ailleurs.',
      'Les Sessions sont nées en 2024. C\u2019est le moment le plus ouvert. Le plus libre, aussi.',
    ],
    linkText: 'Dates et prochaines sessions sur toileblanchecontemporary.com',
  },
  artiste: {
    meta: 'Une fois par an, janvier ou février',
    lede: 'Un artiste. Un mois. Une \u0153uvre qui reste.',
    body1: 'Chaque hiver, les Leroy Brothers invitent un artiste à venir à Toile Blanche pour un mois.',
    body2:
      'L\u2019artiste dispose de Toile Blanche dans son entièreté. Il travaille comme il a besoin de travailler, dans la suite, dans les lieux, dans l\u2019atelier par arrangement. Les Brothers sont présents mais sans directive. La relation se développe comme elle se développe.',
    body3:
      'À la fin du séjour, une \u0153uvre entre dans la collection permanente. Elle est installée et elle reste. Les hôtes futurs la rencontrent sans qu\u2019on leur raconte son histoire, jusqu\u2019à ce qu\u2019ils posent la question. La question est le début de la conversation que l\u2019invitation a mise en mouvement des mois auparavant.',
    accessLabel: 'Comment cela fonctionne',
    accessValue: 'Une invitation personnelle, pas un appel à candidatures',
    accessNote:
      'L\u2019Artiste Invité n\u2019a ni processus de candidature ni jury. C\u2019est une invitation faite par des artistes à un artiste, une fois par an, en hiver. La \u0153uvre qui en résulte est une conséquence du séjour, pas une commande.',
  },
  ecrivain: {
    meta: 'Chaque hiver, novembre à mars',
    lede: 'Un écrivain en résidence.',
    body1:
      'En hiver, quelqu\u2019un arrive. Pas pour enseigner. Pas pour produire quelque chose de défini. Pour écrire.',
    body2:
      'Dans une suite, quelques jours, parfois deux semaines. Le temps devant soi. La lumière, le silence. Toile Blanche n\u2019intervient pas.',
    body3: 'La forme importe peu. Roman, essai, critique, film.',
    body4:
      'Ce qui compte, c\u2019est la relation au langage. Suffisamment forte pour que d\u2019autres aient envie d\u2019être là.',
    body5: 'Le soir décide.',
    accessLabel: 'Comment cela fonctionne',
    accessValue: 'Une invitation. Pas de candidature. Pas d\u2019annonce.',
    accessNote: 'Ce n\u2019est pas un programme. C\u2019est une ouverture.',
  },
  closing: {
    p1: 'Certains viennent une seule fois et emportent le lieu en souvenir. D\u2019autres reviennent, jusqu\u2019à ce que tout leur semble familier. Avec le temps, quelques-uns en font simplement partie. Nous avons un nom pour chacun, même si nous les utilisons rarement à voix haute.',
    p2: 'Certains hôtes viennent à Toile Blanche en hiver sans intention de rejoindre quoi que ce soit. Ils viennent parce que le village est plus calme, les fondations moins fréquentées, la table au Restaurant plus facile à trouver. Parce qu\u2019ils ont passé une vie à construire une relation avec la culture, et qu\u2019ils savent que sa meilleure version se vit lentement, sans programme, dans un lieu qui comprend ce qu\u2019ils cherchent.',
    p3: 'Pour ces hôtes-là, La Vie Ici est simplement la raison de venir en novembre plutôt qu\u2019en juillet. Le reste se fait naturellement.',
    p4: 'La Vie Ici n\u2019est pas un calendrier d\u2019événements.',
    contactLabel: 'Pour toute demande',
    contactTitle: 'Écrivez-nous.',
    contactP1:
      'Pour La Semaine, L\u2019Atelier et Vignes Vivantes,\nindiquez le programme, la saison,\net le nombre de personnes.\nNous répondons sous 48 heures.',
    contactP2:
      'Pour L\u2019Artiste et L\u2019Écrivain,\nUniquement sur invitation.\nSi une personne vous semble éligible,\nvous pouvez nous écrire à son sujet.',
  },
};

export const laVieIciByLocale: Record<Locale, LaVieIciStrings> = {
  en,
  fr,
};

export function getLaVieIciCopy(locale: Locale): LaVieIciStrings {
  return laVieIciByLocale[locale];
}
