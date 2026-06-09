import { Avatar, StatusPill, LinkStatusTag } from "@components";
import type { Client } from "@types";
import "./ClientRow.css";

export type ClientRowProps = {
  client: Client;
  onOpen: () => void;
};

export function ClientRow({ client, onOpen }: ClientRowProps) {
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
      <td className="client-row__mono">{client.lastUpload || "—"}</td>
      <td className="client-row__num">
        {client.currentFiles > 0 ? `${client.currentFiles} fisiere` : <span className="client-row__muted">—</span>}
      </td>
      <td>
        <LinkStatusTag status={client.linkStatus ?? "negenerat"} />
      </td>
      <td>
        <StatusPill status={client.currentStatus} />
      </td>
    </tr>
  );
}
