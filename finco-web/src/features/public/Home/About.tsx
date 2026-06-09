import { Icon } from "@components";
import { COMPANY, SECTIONS } from "@constants/company";
import "./About.css";

// Sectiunea Despre noi: text de prezentare + statistici cheie.
export function About() {
  return (
    <section id={SECTIONS.DESPRE} className="home-section about">
      <div className="about__grid">
        <div className="about__text">
          <span className="home-section__eyebrow t-overline">Despre noi</span>
          <h2 className="about__title t-h1">{COMPANY.despre.titlu}</h2>
          {COMPANY.despre.paragrafe.map((p, i) => (
            <p key={i} className="about__para t-body">
              {p}
            </p>
          ))}
        </div>

        <ul className="about__stats">
          {COMPANY.despre.statistici.map((s) => (
            <li key={s.eticheta} className="about__stat">
              <span className="about__stat-value t-display">{s.valoare}</span>
              <span className="about__stat-label t-label">{s.eticheta}</span>
            </li>
          ))}
          <li className="about__stat about__stat--note">
            <span className="about__stat-icon">
              <Icon name="check-circle-2" size={18} />
            </span>
            <span className="about__stat-label t-label">Contabil dedicat pentru fiecare client</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
