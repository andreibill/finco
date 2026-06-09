// Datele cabinetului pentru site-ul public (prezentare + SEO + footer).
// Continut placeholder, romana fara diacritice — usor de inlocuit cu datele reale.
// Tot ce afiseaza partea publica de prezentare se trage de aici.

// Id-urile sectiunilor de pe pagina de start (ancorele din meniu).
export const SECTIONS = {
  SERVICII: "servicii",
  DESPRE: "despre",
  CONTACT: "contact",
} as const;

export type Serviciu = {
  icon: string; // nume iconita (vezi components/Icon)
  titlu: string;
  descriere: string;
};

export type Statistica = {
  valoare: string;
  eticheta: string;
};

export type ProgramZi = {
  zile: string;
  ore: string;
};

export type LinkSocial = {
  eticheta: string;
  icon: string;
  href: string;
};

export const COMPANY = {
  nume: "FINCO Expert",
  tagline: "Birou de contabilitate si consultanta fiscala",
  descriere:
    "Tinem contabilitatea firmei tale la zi, depunem declaratiile la timp si iti " +
    "explicam clar cifrele — ca tu sa te concentrezi pe afacere, nu pe hartii.",
  fondatIn: 2009,

  // Servicii — afisate ca grila de carduri in sectiunea Servicii.
  servicii: [
    {
      icon: "calculator",
      titlu: "Contabilitate financiara",
      descriere:
        "Evidenta contabila completa, de la inregistrarile zilnice pana la bilantul anual.",
    },
    {
      icon: "users",
      titlu: "Salarizare si resurse umane",
      descriere:
        "Calcul salarii, state de plata, administrare contracte si declaratii aferente.",
    },
    {
      icon: "briefcase",
      titlu: "Consultanta fiscala",
      descriere:
        "Optimizare fiscala si raspunsuri clare la intrebarile despre taxe si impozite.",
    },
    {
      icon: "receipt",
      titlu: "Declaratii si TVA",
      descriere:
        "Intocmim si depunem la timp toate declaratiile catre ANAF, fara intarzieri.",
    },
    {
      icon: "bar-chart-3",
      titlu: "Raportare si analiza",
      descriere:
        "Rapoarte financiare periodice care iti arata exact cum sta firma in fiecare luna.",
    },
    {
      icon: "building-2",
      titlu: "Infiintari si modificari firme",
      descriere:
        "Asistenta completa la infiintarea, modificarea sau radierea societatii.",
    },
  ] as Serviciu[],

  // Sectiunea Despre noi.
  despre: {
    titlu: "Un partener de incredere pentru firma ta",
    paragrafe: [
      "Suntem un birou de contabilitate cu peste 15 ani de experienta, alaturi de " +
        "antreprenori, IMM-uri si profesii liberale din toate domeniile.",
      "Lucram cu instrumente moderne si proceduri clare: primesti documentele " +
        "centralizate, termenele respectate si un contabil dedicat cu care vorbesti " +
        "pe limba ta, nu in jargon fiscal.",
    ],
    statistici: [
      { valoare: "15+", eticheta: "ani de experienta" },
      { valoare: "200+", eticheta: "clienti activi" },
      { valoare: "100%", eticheta: "declaratii la timp" },
    ] as Statistica[],
  },

  // Datele de contact.
  contact: {
    adresa: "Str. Exemplu nr. 10",
    oras: "Bucuresti, Sector 1",
    telefon: "+40 21 000 0000",
    telefonHref: "tel:+40210000000",
    email: "contact@finco.ro",
    program: [
      { zile: "Luni - Vineri", ore: "09:00 - 18:00" },
      { zile: "Sambata - Duminica", ore: "Inchis" },
    ] as ProgramZi[],
  },

  // Retele sociale (footer). Href-uri placeholder.
  social: [
    { eticheta: "Facebook", icon: "facebook", href: "#" },
    { eticheta: "LinkedIn", icon: "linkedin", href: "#" },
    { eticheta: "Instagram", icon: "instagram", href: "#" },
  ] as LinkSocial[],
} as const;
