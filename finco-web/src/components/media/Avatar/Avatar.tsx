import "./Avatar.css";

export type AvatarProps = {
  initials: string;
  size?: number;
  tone?: "orange" | "graphite";
};

export function Avatar({ initials, size = 32, tone = "orange" }: AvatarProps) {
  return (
    <span
      className={`avatar avatar--${tone}`}
      style={{ width: size, height: size, fontSize: Math.max(11, Math.floor(size * 0.38)) }}
    >
      {initials}
    </span>
  );
}
