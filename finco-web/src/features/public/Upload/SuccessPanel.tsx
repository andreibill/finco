import { SplitCard, Icon } from "@components";
import { formatBytes } from "@utils/format";
import type { PublicUploadContext } from "@types";
import "./SuccessPanel.css";

function SuccessHero({ context }: { context: PublicUploadContext }) {
  return (
    <aside className="success-hero">
      <div className="success-hero__glow" aria-hidden />
      <div className="success-hero__dots" aria-hidden />
      <div className="success-hero__top">
        <span className="success-hero__badge">
          <Icon name="check" size={12} />
          Confirmat
        </span>
      </div>
      <div className="success-hero__mid">
        <div className="success-hero__company">{context.companyName}</div>
        <div className="success-hero__big">Multumim.</div>
        <div className="success-hero__sub">Arhiva pentru luna {context.periodLabel} a ajuns la cabinet.</div>
      </div>
      <div className="success-hero__foot">{context.period} · transferat</div>
    </aside>
  );
}

export type SuccessPanelProps = {
  file: File;
  context: PublicUploadContext;
  onAgain: () => void;
};

export function SuccessPanel({ file, context, onAgain }: SuccessPanelProps) {
  return (
    <SplitCard hero={<SuccessHero context={context} />}>
      <div className="success">
        <div className="success__step">Upload finalizat</div>
        <h1 className="success__title">
          Fisierele au fost <span className="success__title-accent">primite</span>.
        </h1>
        <p className="success__text">
          Cabinetul a fost notificat. Puteti reveni cu fisiere suplimentare folosind acelasi link pana la{" "}
          <strong>{context.expira_la}</strong>.
        </p>

        <div className="success__file">
          <span className="success__file-icon">
            <Icon name="check-circle-2" size={26} />
          </span>
          <div className="success__file-info">
            <div className="success__file-name">{file.name}</div>
            <div className="success__file-meta">{formatBytes(file.size)} · stocat in cabinet</div>
          </div>
        </div>

        <div className="success__spacer" />

        <div className="success__actions">
          <button className="success__btn success__btn--secondary" onClick={onAgain}>
            <Icon name="upload" size={16} />
            Incarca alte fisiere
          </button>
          <button className="success__btn success__btn--primary" onClick={onAgain}>
            Inchide
            <Icon name="arrow-right" size={16} />
          </button>
        </div>
      </div>
    </SplitCard>
  );
}
