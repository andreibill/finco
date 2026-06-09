import { Icon } from "@components/media/Icon/Icon";
import type { LinkStatus } from "@types";
import "./LinkStatusTag.css";

// Eticheta statusului linkului de upload pentru o perioada (icon + text, niciodata
// doar culoare — a11y). Folosita in lista (ClientRow) si in antetul bibliotecii.
const CONFIG: Record<LinkStatus, { icon: string; label: string; tone: string }> = {
  trimis: { icon: "check-circle-2", label: "Trimis", tone: "ok" },
  esuat: { icon: "alert-circle", label: "Esuat", tone: "err" },
  negenerat: { icon: "circle", label: "Fara link", tone: "muted" },
};

export function LinkStatusTag({ status }: { status: LinkStatus }) {
  const cfg = CONFIG[status];
  return (
    <span className={`link-status link-status--${cfg.tone}`}>
      {cfg.tone !== "muted" && <Icon name={cfg.icon} size={14} />}
      {cfg.label}
    </span>
  );
}
