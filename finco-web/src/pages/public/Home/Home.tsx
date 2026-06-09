import { Seo } from "@components";
import { ROUTES } from "@constants/routes";
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION, ACCOUNTING_JSONLD } from "@constants/seo";
import { SiteLayout } from "@surfaces/PublicApp/SiteLayout/SiteLayout";
import { Hero } from "@features/public/Home/Hero";
import { Services } from "@features/public/Home/Services";
import { About } from "@features/public/Home/About";
import { Contact } from "@features/public/Home/Contact";
import "./Home.css";

// Pagina de start publica: prezentarea cabinetului (hero, servicii, despre, contact).
export function Home() {
  return (
    <SiteLayout>
      <Seo
        title={DEFAULT_TITLE}
        description={DEFAULT_DESCRIPTION}
        path={ROUTES.PUBLIC.HOME}
        jsonLd={ACCOUNTING_JSONLD}
      />
      <Hero />
      <Services />
      <About />
      <Contact />
    </SiteLayout>
  );
}
