import { Icon } from "../Icon/Icon";
import "./IconButton.css";

export type IconButtonProps = {
  name: string;
  label: string; // obligatoriu — devine aria-label
  onClick?: () => void;
  size?: number;
  iconSize?: number;
  tone?: "neutral" | "danger";
};

export function IconButton({
  name,
  label,
  onClick,
  size = 32,
  iconSize = 16,
  tone = "neutral",
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`icon-btn icon-btn--${tone}`}
      style={{ width: size, height: size }}
    >
      <Icon name={name} size={iconSize} />
    </button>
  );
}
