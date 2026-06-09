// Constante SEO pentru partea publica. Componenta <Seo> seteaza tag-urile de head
// per ruta; aici sunt valorile de baza si schema JSON-LD a cabinetului.
import { COMPANY } from "@constants/company";

// Host-ul de productie. Pe GitHub Pages base-ul este /finco/, dar URL-urile SEO
// (canonical, sitemap) tintesc domeniul real.
export const SITE_URL = "https://finco.ro";
export const SITE_NAME = COMPANY.nume;
export const OG_IMAGE = "/finco-logo.jpg";

export const DEFAULT_TITLE = `${COMPANY.nume} — ${COMPANY.tagline}`;
export const DEFAULT_DESCRIPTION = COMPANY.descriere;

// Titlu per pagina: "<pagina> — FINCO Expert".
export const pageTitle = (pagina: string) => `${pagina} — ${SITE_NAME}`;

// JSON-LD pentru un birou de contabilitate (Google: rich data + SEO local).
// Obiect stabil la nivel de modul (identitate constanta pentru efectul din <Seo>).
export const ACCOUNTING_JSONLD = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: COMPANY.nume,
  description: COMPANY.descriere,
  url: SITE_URL,
  image: `${SITE_URL}${OG_IMAGE}`,
  telephone: COMPANY.contact.telefon,
  email: COMPANY.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.contact.adresa,
    addressLocality: COMPANY.contact.oras,
    addressCountry: "RO",
  },
  openingHours: "Mo-Fr 09:00-18:00",
  priceRange: "$$",
} as const;
