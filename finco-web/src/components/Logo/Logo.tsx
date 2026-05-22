import { FincoMark } from "./FincoMark";
import "./Logo.css";

export type LogoProps = {
  wordmark?: boolean;
  size?: number;
};

export function Logo({ wordmark = true, size = 24 }: LogoProps) {
  return (
    <span className="logo">
      <FincoMark size={size} />
      {wordmark && (
        <span className="logo__wordmark">
          <span className="logo__name" style={{ fontSize: size * 0.72 }}>
            FINCO
          </span>
          <span className="logo__sub" style={{ fontSize: size * 0.54 }}>
            expert
          </span>
        </span>
      )}
    </span>
  );
}
