import { Link } from "react-router-dom";
import { Icon } from "@components";
import { ROUTES } from "@constants/routes";
import { COMPANY, SECTIONS } from "@constants/company";
import "./Hero.css";

// Sectiunea hero: mesajul principal + CTA-uri catre fluxul de upload si servicii.
export function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <span className="hero__badge">
          <Icon name="shield-check" size={14} />
          {COMPANY.tagline}
        </span>

        <h1 className="hero__title">
          Contabilitate fara batai de cap pentru firma ta
        </h1>

        <p className="hero__lead">{COMPANY.descriere}</p>

        <div className="hero__actions">
          <Link to={ROUTES.PUBLIC.CERE_LINK} className="btn btn--primary btn--lg hero__cta">
            <Icon name="upload" size={16} />
            Trimite documente
          </Link>
          <a href={`#${SECTIONS.SERVICII}`} className="hero__cta-ghost">
            Vezi serviciile
            <Icon name="arrow-right" size={16} />
          </a>
        </div>

        <ul className="hero__trust">
          {COMPANY.despre.statistici.map((s) => (
            <li key={s.eticheta} className="hero__trust-item">
              <span className="hero__trust-value">{s.valoare}</span>
              <span className="hero__trust-label">{s.eticheta}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
