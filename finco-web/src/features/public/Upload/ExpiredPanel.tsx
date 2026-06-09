import { useNavigate } from "react-router-dom";
import { SplitCard, Icon } from "@components";
import { HeroPanel } from "@features/public/Upload/HeroPanel";
import { ROUTES } from "@constants/routes";
import type { PublicUploadContext } from "@types";
import "./ExpiredPanel.css";

export function ExpiredPanel({ context }: { context: PublicUploadContext }) {
  const navigate = useNavigate();
  return (
    <SplitCard hero={<HeroPanel context={context} />}>
      <div className="expired">
        <span className="expired__icon">
          <Icon name="alert-circle" size={28} />
        </span>
        <h1 className="expired__title">Link expirat</h1>
        <p className="expired__text">
          Linkul a expirat la <strong>{context.expiredAt}</strong>. Cereti unul nou folosind formularul public — vom
          trimite imediat un link nou pe email.
        </p>
        <button className="expired__cta" onClick={() => navigate(ROUTES.PUBLIC.CERE_LINK)}>
          <Icon name="refresh-cw" size={16} />
          Cere un link nou
        </button>
      </div>
    </SplitCard>
  );
}
