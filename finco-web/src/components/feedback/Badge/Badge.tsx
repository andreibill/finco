import "./Badge.css";

export type BadgeVariant = "neutral" | "brand" | "mono" | "success";

export type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}
