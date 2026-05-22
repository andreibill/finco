import { Icon } from "../../components/Icon/Icon";
import { Badge } from "../../components/Badge/Badge";
import { StatusPill } from "../../components/StatusPill/StatusPill";
import { formatPeriodLabel } from "../../utils/format";
import type { Period } from "../../types";
import "./PeriodRow.css";

export type PeriodRowProps = {
  period: Period;
  onOpen: () => void;
};

export function PeriodRow({ period, onOpen }: PeriodRowProps) {
  const monthLabel = formatPeriodLabel(period.an_luna);
  return (
    <div
      className="period-row"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
    >
      <span className={`period-row__folder period-row__folder--${period.status}`}>
        <Icon name={period.status === "empty" ? "folder" : "folder-open"} size={20} />
      </span>
      <div className="period-row__main">
        <div className="period-row__title-line">
          <span className="period-row__month">{monthLabel}</span>
          <Badge variant="mono">{period.an_luna}</Badge>
        </div>
        <div className="period-row__sub">
          {period.last_upload ? `Ultim upload: ${period.last_upload}` : "Fara upload"}
        </div>
      </div>
      <div className="period-row__files">
        {period.numar_fisiere > 0 ? `${period.numar_fisiere} fisiere` : <span className="period-row__muted">—</span>}
      </div>
      <StatusPill status={period.status} />
      <Icon name="chevron-right" size={16} />
    </div>
  );
}
