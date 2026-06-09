import "./Tooltip.css";

export type TooltipProps = {
  text: string;
  placement?: "top" | "left";
  children: React.ReactNode;
};

// Bula informativa la hover / focus pe elementul invelit (CSS, fara pozitionare JS).
// `children` ramane declansatorul; pune un buton focusabil inauntru pentru a fi accesibil.
export function Tooltip({ text, placement = "top", children }: TooltipProps) {
  return (
    <span className={`tooltip tooltip--${placement}`}>
      {children}
      <span className="tooltip__bubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}
