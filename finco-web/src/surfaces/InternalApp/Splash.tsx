import { Logo } from "@components";
import "./Splash.css";

// Ecran de incarcare in timpul fazei de hidratare (isHydrating). Evita
// palpairea Login inainte sa stim daca utilizatorul e deja logat.
export function Splash() {
  return (
    <div className="splash">
      <Logo size={40} />
      <div className="splash__bar">
        <span className="splash__bar-fill" />
      </div>
    </div>
  );
}
