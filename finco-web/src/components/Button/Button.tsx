import { Icon } from "../Icon/Icon";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: string;
  iconRight?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  children,
  onClick,
  disabled,
  type = "button",
  fullWidth,
}: ButtonProps) {
  const iconSize = size === "lg" ? 16 : 14;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--${variant} btn--${size}${fullWidth ? " btn--full" : ""}`}
    >
      {iconLeft && <Icon name={iconLeft} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}
