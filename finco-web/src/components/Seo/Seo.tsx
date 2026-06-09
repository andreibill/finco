import { useEffect } from "react";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@constants/seo";

// Gestionar de <head> fara dependinte externe: seteaza title, meta description,
// robots, canonical, OpenGraph/Twitter si (optional) JSON-LD per ruta. Toate
// tag-urile generate sunt marcate cu data-seo si reactualizate la schimbare.
export type SeoProps = {
  title: string;
  description?: string;
  path?: string; // ex: "/", "/cere-link"
  image?: string;
  noindex?: boolean;
  jsonLd?: object;
};

// Creeaza/actualizeaza un <meta> marcat data-seo, dupa name sau property.
function setMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"][data-seo]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute("data-seo", "");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function Seo({ title, description, path = "/", image = OG_IMAGE, noindex, jsonLd }: SeoProps) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;

    document.title = title;
    if (description) setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    // OpenGraph
    setMeta("property", "og:title", title);
    if (description) setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", url);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "ro_RO");
    setMeta("property", "og:image", `${SITE_URL}${image}`);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    if (description) setMeta("name", "twitter:description", description);

    // Canonical
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"][data-seo]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      canonical.setAttribute("data-seo", "");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // JSON-LD
    let ld = document.head.querySelector<HTMLScriptElement>('script[type="application/ld+json"][data-seo]');
    if (jsonLd) {
      if (!ld) {
        ld = document.createElement("script");
        ld.type = "application/ld+json";
        ld.setAttribute("data-seo", "");
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(jsonLd);
    } else if (ld) {
      ld.remove();
    }
  }, [title, description, path, image, noindex, jsonLd]);

  return null;
}
