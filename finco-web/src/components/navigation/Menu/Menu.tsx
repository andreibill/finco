import { useEffect, useRef, useState } from "react";
import { Icon } from "@components/media/Icon/Icon";
import { IconButton } from "@components/buttons/IconButton/IconButton";
import "./Menu.css";

export type MenuItem = {
  label: string;
  onClick: () => void;
  icon?: string;
  tone?: "default" | "danger";
};

export type MenuProps = {
  // aria-label pentru declansatorul cu trei puncte.
  label: string;
  items: MenuItem[];
  triggerIcon?: string;
};

// Meniu de actiuni declansat de un buton-iconita (implicit trei puncte). Se inchide
// la click in afara sau la Escape. Construit peste IconButton (primitiva de baza).
export function Menu({ label, items, triggerIcon = "more-horizontal" }: MenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="menu" ref={ref}>
      <IconButton name={triggerIcon} label={label} onClick={() => setOpen((o) => !o)} />
      {open && (
        <div className="menu__list" role="menu">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={`menu__item${item.tone === "danger" ? " menu__item--danger" : ""}`}
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
            >
              {item.icon && <Icon name={item.icon} size={15} />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
