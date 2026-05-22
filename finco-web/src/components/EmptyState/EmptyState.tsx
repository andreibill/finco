import { Icon } from "../Icon/Icon";
import { Button } from "../Button/Button";
import "./EmptyState.css";

export type EmptyStateProps = {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;
};

export function EmptyState({ icon = "inbox", title, message, actionLabel, actionIcon, onAction }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">
        <Icon name={icon} size={22} />
      </span>
      <div className="empty-state__title">{title}</div>
      {message && <div className="empty-state__message">{message}</div>}
      {actionLabel && onAction && (
        <div className="empty-state__action">
          <Button variant="primary" iconLeft={actionIcon} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
