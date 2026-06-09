import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo, Icon } from "@components";
import { ROUTES } from "@constants/routes";
import { SECTIONS } from "@constants/company";
import "./SiteHeader.css";

const NAV = [
  { label: "Servicii", href: `#${SECTIONS.SERVICII}` },
  { label: "Despre", href: `#${SECTIONS.DESPRE}` },
  { label: "Contact", href: `#${SECTIONS.CONTACT}` },
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
            <a key={item.href} href={item.href} className="site-header__link" onClick={close}>
              {item.label}
            </a>
          ))}
          <Link
            to={ROUTES.APP.LOGIN}
            className="site-header__link site-header__link--muted"
            onClick={close}
          >
            Autentificare cabinet
          </Link>
          <Link
            to={ROUTES.PUBLIC.CERE_LINK}
            className="btn btn--primary btn--md site-header__cta"
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
