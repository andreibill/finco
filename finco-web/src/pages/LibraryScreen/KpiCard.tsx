import { Card } from "../../components/Card/Card";
import { Icon } from "../../components/Icon/Icon";
import "./KpiCard.css";

export type KpiTone = "complete" | "partial" | "empty" | "brand";

export type KpiCardProps = {
  icon: string;
  tone: KpiTone;
  label: string;
  value: number;
  total?: number;
  hint: string;
};

export function KpiCard({ icon, tone, label, value, total, hint }: KpiCardProps) {
  return (
    <Card padding={18}>
      <div className="kpi__head">
        <span className="kpi__label">{label}</span>
        <span className={`kpi__icon kpi__icon--${tone}`}>
          <Icon name={icon} size={16} />
        </span>
      </div>
      <div className="kpi__value">
        {value}
        {typeof total === "number" && <span className="kpi__total"> / {total}</span>}
      </div>
      <div className="kpi__hint">{hint}</div>
    </Card>
  );
}
