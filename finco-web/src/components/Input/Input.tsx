import { Icon } from "../Icon/Icon";
import "./Input.css";

export type InputProps = {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  iconLeft?: string;
  error?: boolean;
  autoFocus?: boolean;
  id?: string;
  name?: string;
  inputMode?: "text" | "numeric" | "email";
  ariaDescribedBy?: string;
  rightSlot?: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
};

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  iconLeft,
  error,
  autoFocus,
  id,
  name,
  inputMode,
  ariaDescribedBy,
  rightSlot,
  onKeyDown,
  onBlur,
}: InputProps) {
  return (
    <div className={`input-wrap${error ? " input-wrap--error" : ""}`}>
      {iconLeft && (
        <span className="input-wrap__icon">
          <Icon name={iconLeft} size={16} />
        </span>
      )}
      <input
        className={`input${iconLeft ? " input--with-icon" : ""}`}
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        inputMode={inputMode}
        aria-describedby={ariaDescribedBy}
        aria-invalid={error || undefined}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
      {rightSlot && <span className="input-wrap__right">{rightSlot}</span>}
    </div>
  );
}
