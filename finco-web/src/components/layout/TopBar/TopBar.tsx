import { Fragment } from "react";
import { Icon } from "@components/media/Icon/Icon";
import "./TopBar.css";

export type Breadcrumb = { label: string; onClick?: () => void };

export type TopBarProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  right?: React.ReactNode;
  onToggleSidebar?: () => void;
};

export function TopBar({ title, subtitle, breadcrumbs, right, onToggleSidebar }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        {onToggleSidebar && (
          <button className="topbar__hamburger" onClick={onToggleSidebar} aria-label="Meniu">
            <Icon name="menu" size={20} />
          </button>
        )}
        <div className="topbar__titles">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            // Calea e chiar titlul mare: stramosii (cu onClick) sunt link-uri
            // estompate, segmentul curent e accentuat. Fara dublarea titlului.
            <h1 className="topbar__title topbar__title--path">
              {breadcrumbs.map((b, i) => (
                <Fragment key={i}>
                  {i > 0 && <Icon name="chevron-right" size={18} className="topbar__title-sep" />}
                  {b.onClick ? (
                    <button className="topbar__title-crumb topbar__title-crumb--link" onClick={b.onClick}>
                      {b.label}
                    </button>
                  ) : (
                    <span className="topbar__title-crumb">{b.label}</span>
                  )}
                </Fragment>
              ))}
            </h1>
          ) : (
            <div className="topbar__heading">
              <h1 className="topbar__title">{title}</h1>
              {subtitle && <span className="topbar__subtitle">{subtitle}</span>}
            </div>
          )}
        </div>
      </div>
      <div className="topbar__right">{right}</div>
    </header>
  );
}
