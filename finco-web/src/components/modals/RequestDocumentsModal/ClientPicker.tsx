import { useState } from "react";
import { Icon, Avatar, Input } from "@components";
import { useAllClients } from "@hooks/useClients";
import type { Client } from "@types";
import "./ClientPicker.css";

export type ClientPickerProps = {
  value: Client | null;
  onChange: (client: Client) => void;
};

export function ClientPicker({ value, onChange }: ClientPickerProps) {
  const [open, setOpen] = useState(false);
  const [cauta, setCauta] = useState("");
  const { data: clients = [] } = useAllClients();

  const filtered = clients.filter((c) => {
    const q = cauta.trim().toLowerCase();
    return !q || c.nume.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="client-picker">
      <button type="button" className="client-picker__trigger" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <span className={value ? "" : "client-picker__placeholder"}>{value ? value.nume : "Alege un client..."}</span>
        <span className="client-picker__chevron">
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      {open && (
        <div className="client-picker__menu" role="listbox">
          <div className="client-picker__search">
            <Input value={cauta} onChange={setCauta} placeholder="Cauta client" iconLeft="search" autoFocus />
          </div>
          <div className="client-picker__list">
            {filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                role="option"
                aria-selected={value?.id === c.id}
                className="client-picker__item"
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                  setCauta("");
                }}
              >
                <Avatar initials={c.initials} size={26} tone="graphite" />
                <div className="client-picker__item-info">
                  <div className="client-picker__item-name">{c.nume}</div>
                  <div className="client-picker__item-email">{c.email}</div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <div className="client-picker__empty">Niciun client gasit.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
