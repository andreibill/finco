import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";
import "./Toast.css";

export type ToastTone = "ok" | "warn" | "err" | "info";

export type ToastProps = {
  tone?: ToastTone;
  title: string;
  body?: string;
  onClose?: () => void;
};

const TONE_ICON: Record<ToastTone, string> = {
  ok: "check-circle-2",
  warn: "alert-triangle",
  err: "alert-circle",
  info: "info",
};

export function Toast({ tone = "ok", title, body, onClose }: ToastProps) {
  return (
    <div className={`toast toast--${tone}`} role="status">
      <span className="toast__icon">
        <Icon name={TONE_ICON[tone]} size={18} />
      </span>
      <div className="toast__content">
        <div className="toast__title">{title}</div>
        {body && <div className="toast__body">{body}</div>}
      </div>
      {onClose && <IconButton name="x" onClick={onClose} label="Inchide" size={24} iconSize={14} />}
    </div>
  );
}
