import "./Toggle.css";

export type ToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
};

export function Toggle({ value, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      className={`toggle${value ? " toggle--on" : ""}`}
      onClick={() => onChange(!value)}
      aria-pressed={value}
      aria-label={label}
    >
      <span className="toggle__knob" />
    </button>
  );
}
