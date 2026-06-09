import "./Textarea.css";

export type TextareaProps = {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
  ariaDescribedBy?: string;
};

export function Textarea({ value, onChange, placeholder, rows = 4, id, ariaDescribedBy }: TextareaProps) {
  return (
    <textarea
      className="textarea"
      id={id}
      value={value}
      placeholder={placeholder}
      rows={rows}
      aria-describedby={ariaDescribedBy}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
