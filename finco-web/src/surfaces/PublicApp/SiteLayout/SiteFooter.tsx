import { Link } from "react-router-dom";
import { Logo, Icon } from "@components";
import { ROUTES } from "@constants/routes";
import { COMPANY, SECTIONS } from "@constants/company";
import "./SiteFooter.css";

const AN_CURENT = 2026;

// Subsolul site-ului public: brand, navigatie, contact si retele sociale.
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Logo size={28} />
          <p className="site-footer__tagline">{COMPANY.tagline}</p>
          <ul className="site-footer__social">
            {COMPANY.social.map((s) => (
              <li key={s.eticheta}>
                <a className="site-footer__social-link" href={s.href} aria-label={s.eticheta}>
                  <Icon name={s.icon} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="site-footer__col">
          <span className="site-footer__col-title">Navigare</span>
          <Link to={`${ROUTES.PUBLIC.HOME}#${SECTIONS.SERVICII}`}>Servicii</Link>
          <Link to={`${ROUTES.PUBLIC.HOME}#${SECTIONS.DESPRE}`}>Despre noi</Link>
          <Link to={`${ROUTES.PUBLIC.HOME}#${SECTIONS.CONTACT}`}>Contact</Link>
        </nav>

        <nav className="site-footer__col">
          <span className="site-footer__col-title">Clienti</span>
          <Link to={ROUTES.PUBLIC.CERE_LINK}>Trimite documente</Link>
          <Link to={ROUTES.PUBLIC.CERE_LINK}>Cere un link nou</Link>
          <Link to={ROUTES.APP.LOGIN}>Autentificare cabinet</Link>
        </nav>

        <div className="site-footer__col">
          <span className="site-footer__col-title">Contact</span>
          <span className="site-footer__muted">
            {COMPANY.contact.adresa}, {COMPANY.contact.oras}
          </span>
          <a href={COMPANY.contact.telefonHref}>{COMPANY.contact.telefon}</a>
          <a href={`mailto:${COMPANY.contact.email}`}>{COMPANY.contact.email}</a>
        </div>
      </div>

      <div className="site-footer__bottom">
        © {AN_CURENT} {COMPANY.nume}. Toate drepturile rezervate.
      </div>
    </footer>
  );
}
