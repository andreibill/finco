import "./Card.css";

export type CardProps = {
  children: React.ReactNode;
  padding?: number;
  hoverable?: boolean;
  className?: string;
};

export function Card({ children, padding = 20, hoverable, className }: CardProps) {
  return (
    <div
      className={`card${hoverable ? " card--hoverable" : ""}${className ? " " + className : ""}`}
      style={{ padding }}
    >
      {children}
    </div>
  );
}
