import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo, Icon } from "@components";
import { ROUTES } from "@constants/routes";
import { SECTIONS } from "@constants/company";
import "./SiteHeader.css";

// Ancore catre sectiunile de pe Home. Folosim calea completa (/#sectiune) ca
// linkul sa mearga si din alte pagini publice; useHashScroll deruleaza apoi.
const NAV = [
  { label: "Servicii", to: `${ROUTES.PUBLIC.HOME}#${SECTIONS.SERVICII}` },
  { label: "Despre", to: `${ROUTES.PUBLIC.HOME}#${SECTIONS.DESPRE}` },
  { label: "Contact", to: `${ROUTES.PUBLIC.HOME}#${SECTIONS.CONTACT}` },
];

// Antet fix al site-ului public: logo, meniu cu ancore, autentificare cabinet si
// CTA-ul principal "Trimite documente". Pe ecran mic meniul se pliaza sub buton.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to={ROUTES.PUBLIC.HOME} className="site-header__brand" onClick={close}>
          <Logo size={28} />
        </Link>

        <nav className={`site-header__nav${open ? " site-header__nav--open" : ""}`}>
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="site-header__link" onClick={close}>
              {item.label}
            </Link>
          ))}
          <Link
            to={ROUTES.PUBLIC.CERE_LINK}
            className="site-header__link site-header__cta"
            onClick={close}
          >
            <Icon name="upload" size={14} />
            Trimite documente
          </Link>
        </nav>

        <button
          type="button"
          className="site-header__toggle"
          aria-label={open ? "Inchide meniul" : "Deschide meniul"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "x" : "menu"} size={20} />
        </button>
      </div>
    </header>
  );
}
