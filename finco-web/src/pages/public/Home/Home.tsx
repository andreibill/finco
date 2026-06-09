import { Seo } from "@components";
import { ROUTES } from "@constants/routes";
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION, ACCOUNTING_JSONLD } from "@constants/seo";
import { SiteHeader } from "@features/public/Home/SiteHeader";
import { Hero } from "@features/public/Home/Hero";
import { Services } from "@features/public/Home/Services";
import { About } from "@features/public/Home/About";
import { Contact } from "@features/public/Home/Contact";
import { SiteFooter } from "@features/public/Home/SiteFooter";
import "./Home.css";

// Pagina de start publica: prezentarea cabinetului (hero, servicii, despre, contact).
export function Home() {
  return (
    <div className="home">
      <Seo
        title={DEFAULT_TITLE}
        description={DEFAULT_DESCRIPTION}
        path={ROUTES.PUBLIC.HOME}
        jsonLd={ACCOUNTING_JSONLD}
      />
      <SiteHeader />
      <main className="home__main">
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
