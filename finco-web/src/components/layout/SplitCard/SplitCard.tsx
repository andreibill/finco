import "./SplitCard.css";

export type SplitCardProps = {
  hero: React.ReactNode;
  children: React.ReactNode;
};

// Card cu doua panouri (hero stanga + continut dreapta). Se stivuieste vertical
// sub ~720px. Reutilizat de Upload / SuccessPanel / ExpiredPanel.
export function SplitCard({ hero, children }: SplitCardProps) {
  return (
    <div className="split-card">
      {hero}
      <div className="split-card__panel">{children}</div>
    </div>
  );
}
