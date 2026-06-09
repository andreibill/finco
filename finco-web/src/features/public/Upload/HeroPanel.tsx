import { Icon } from "@components";
import { monthNameFull } from "@utils/format";
import type { PublicUploadContext } from "@types";
import "./HeroPanel.css";

function HeroMeta({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="hero-meta">
      <span className="hero-meta__icon">
        <Icon name={icon} size={14} />
      </span>
      <div className="hero-meta__text">
        <div className="hero-meta__label">{label}</div>
        <div className="hero-meta__value">{value}</div>
      </div>
    </div>
  );
}

// Panoul hero grafit (luna mare tipografic). Reutilizat de Upload si ExpiredPanel.
export function HeroPanel({ context }: { context: PublicUploadContext }) {
  const monthShort = monthNameFull(context.period).slice(0, 3);
  return (
    <aside className="hero">
      <div className="hero__glow" aria-hidden />
      <div className="hero__dots" aria-hidden />

      <div className="hero__top">
        <span className="hero__badge">
          <span className="hero__badge-dot" />
          Upload securizat
        </span>
      </div>

      <div className="hero__mid">
        <div className="hero__company">{context.companyName}</div>
        <div className="hero__period-line">
          <span className="hero__month">{monthShort}</span>
          <span className="hero__period">{context.period}</span>
        </div>
        <div className="hero__tagline">Documente lunare pentru cabinet — facturi, extrase, bonuri.</div>
      </div>

      <div className="hero__meta">
        <HeroMeta icon="clock" label="Termen limita" value={context.expira_la} />
        <HeroMeta icon="file-archive" label="Format acceptat" value="O singura arhiva .zip" />
        <HeroMeta icon="refresh-cw" label="Re-upload" value="Acelasi link, pana la scadenta" />
      </div>
    </aside>
  );
}
