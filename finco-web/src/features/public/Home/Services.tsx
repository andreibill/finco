import { Card, Icon } from "@components";
import { COMPANY, SECTIONS } from "@constants/company";
import "./Services.css";

// Sectiunea Servicii: grila de carduri, una pentru fiecare serviciu din COMPANY.
export function Services() {
  return (
    <section id={SECTIONS.SERVICII} className="home-section services">
      <div className="home-section__head">
        <span className="home-section__eyebrow t-overline">Servicii</span>
        <h2 className="home-section__title t-h1">Tot ce are nevoie firma ta, intr-un singur loc</h2>
        <p className="home-section__subtitle t-body">
          De la contabilitate zilnica la consultanta fiscala — ne ocupam noi de cifre.
        </p>
      </div>

      <div className="services__grid">
        {COMPANY.servicii.map((serviciu) => (
          <Card key={serviciu.titlu} hoverable className="services__card" padding={24}>
            <span className="services__icon">
              <Icon name={serviciu.icon} size={22} />
            </span>
            <h3 className="services__card-title t-h3">{serviciu.titlu}</h3>
            <p className="services__card-text t-body-sm">{serviciu.descriere}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
