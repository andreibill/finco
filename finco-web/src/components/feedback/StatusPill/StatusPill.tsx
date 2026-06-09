import { STATUS_LABELS } from "@constants/messages";
import "./StatusPill.css";

export type StatusPillStatus = "empty" | "partial" | "complete" | "error";

export type StatusPillProps = {
  status?: StatusPillStatus;
  label?: string;
  size?: "md" | "lg";
};

// Pastreaza mereu textul, nu doar culoarea (a11y — §9).
export function StatusPill({ status = "empty", label, size = "md" }: StatusPillProps) {
  return (
    <span className={`status-pill status-pill--${status} status-pill--${size}`}>
      <span className="status-pill__dot" />
      {label || STATUS_LABELS[status]}
    </span>
  );
}
