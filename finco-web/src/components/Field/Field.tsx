import { useId } from "react";
import "./Field.css";

export type FieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  children: (ids: { inputId: string; describedBy?: string }) => React.ReactNode;
};

// Field leaga label-ul de input si erorile via aria-describedby.
export function Field({ label, hint, error, children }: FieldProps) {
  const inputId = useId();
  const msgId = `${inputId}-msg`;
  const describedBy = error || hint ? msgId : undefined;
  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      {children({ inputId, describedBy })}
      {error ? (
        <span id={msgId} className="field__error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span id={msgId} className="field__hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
