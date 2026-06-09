import { Avatar, StatusPill, Button, IconButton } from "@components";
import type { Client } from "@types";
import "./ClientRow.css";

export type ClientRowProps = {
  client: Client;
  onOpen: () => void;
  onRequest: () => void;
};

export function ClientRow({ client, onOpen, onRequest }: ClientRowProps) {
  return (
    <tr
      className="client-row"
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
    >
      <td>
        <div className="client-row__client">
          <Avatar initials={client.initials} size={34} tone="graphite" />
          <div>
            {/* Numele e focusabil pentru navigare la tastatura (a11y §9). */}
            <button className="client-row__name" onClick={onOpen}>
              {client.nume}
            </button>
            <div className="client-row__email">{client.email}</div>
          </div>
        </div>
      </td>
      <td>
        <StatusPill status={client.currentStatus} />
      </td>
      <td className="client-row__mono">{client.lastUpload || "—"}</td>
      <td className="client-row__num">
        {client.currentFiles > 0 ? `${client.currentFiles} fisiere` : <span className="client-row__muted">—</span>}
      </td>
      <td className="client-row__num client-row__mono">ziua {client.zi_trimitere}</td>
      <td className="client-row__actions" onClick={(e) => e.stopPropagation()}>
        <div className="client-row__actions-inner">
          <Button variant="secondary" size="sm" iconLeft="mail-plus" onClick={onRequest}>
            Cere fisiere
          </Button>
          <IconButton name="more-horizontal" label="Actiuni client" />
        </div>
      </td>
    </tr>
  );
}
