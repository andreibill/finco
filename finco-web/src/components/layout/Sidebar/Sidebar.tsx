import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@components/media/Logo/Logo";
import { Icon } from "@components/media/Icon/Icon";
import { Avatar } from "@components/media/Avatar/Avatar";
import { IconButton } from "@components/buttons/IconButton/IconButton";
import { ROUTES } from "@constants/routes";
import type { User } from "@types";
import "./Sidebar.css";

export type SidebarProps = {
  user: User;
  onLogout: () => void;
  onNavigate?: () => void; // inchide drawer-ul pe mobil dupa navigare
};

type NavItem = { label: string; icon: string; to: string; matchPrefixes: string[] };

const NAV_ITEMS: NavItem[] = [
  // Biblioteca acopera si detaliul clientului / perioadei (raman evidentiate aici).
  { label: "Biblioteca", icon: "folder-open", to: ROUTES.APP.BIBLIOTECA, matchPrefixes: [ROUTES.APP.BIBLIOTECA, `${ROUTES.APP.ROOT}/clienti`] },
  { label: "Cereri trimise", icon: "mail", to: ROUTES.APP.CERERI, matchPrefixes: [ROUTES.APP.CERERI] },
  { label: "Setari", icon: "settings", to: ROUTES.APP.SETARI, matchPrefixes: [ROUTES.APP.SETARI] },
];

export function Sidebar({ user, onLogout, onNavigate }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const go = (to: string) => {
    navigate(to);
    onNavigate?.();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <Logo size={26} />
      </div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((it) => {
          const active = it.matchPrefixes.some((p) => location.pathname.startsWith(p));
          return (
            <button
              key={it.label}
              className={`sidebar__item${active ? " sidebar__item--active" : ""}`}
              onClick={() => go(it.to)}
            >
              <span className="sidebar__icon">
                <Icon name={it.icon} size={18} />
              </span>
              {it.label}
            </button>
          );
        })}
      </nav>
      <div className="sidebar__user">
        <Avatar initials={user.initials} size={32} />
        <div className="sidebar__user-info">
          <div className="sidebar__user-name">{user.nume}</div>
          <div className="sidebar__user-role">angajat cabinet</div>
        </div>
        <IconButton name="log-out" label="Iesire" onClick={onLogout} />
      </div>
    </aside>
  );
}
