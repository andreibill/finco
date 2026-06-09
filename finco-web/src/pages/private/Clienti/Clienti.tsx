import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Input, Button, Avatar, StatusPill, Badge, SkeletonRows, EmptyState } from "@components";
import { ClientFormModal } from "@components/modals/ClientFormModal/ClientFormModal";
import { PageShell } from "@surfaces/InternalApp/PageShell";
import { useClients } from "@hooks/useClients";
import { ROUTES } from "@constants/routes";
import { MESSAGES } from "@constants/messages";
import "./Clienti.css";

// Lista cu toti clientii inregistrati in aplicatie: tabel simplu cu cautare si
// adaugare client. Activarea/dezactivarea unui client se face din pagina lui
// (clienti/:id), nu din tabel. Cautarea (dupa nume sau email) traieste in URL
// (?cauta=...), deci ramane partajabila si rezista la refresh — vezi
// rules/frontend.md §5.
export function Clienti() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const cauta = params.get("cauta") ?? "";

  // Reutilizam useClients (filtrare nume/email); statusul ramane mereu "all".
  const clients = useClients({ cauta, status: "all" });

  const [addOpen, setAddOpen] = useState(false);

  const total = clients.data?.length ?? 0;

  const setCauta = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set("cauta", value);
    else next.delete("cauta");
    setParams(next, { replace: true });
  };

  return (
    <PageShell title="Clienti">
      <div className="clienti">
        <div className="clienti__toolbar">
          <div className="clienti__search">
            <Input
              value={cauta}
              onChange={setCauta}
              placeholder="Cauta clienti dupa nume sau email"
              iconLeft="search"
            />
          </div>
          <div className="clienti__spacer" />
          <Button variant="primary" iconLeft="user-plus" onClick={() => setAddOpen(true)}>
            Adauga client
          </Button>
        </div>
        <Card padding={0} className="clienti__table-card">
          {clients.isLoading ? (
            <SkeletonRows rows={6} />
          ) : clients.isError ? (
            <EmptyState
              icon="alert-circle"
              title={MESSAGES.LOAD_ERROR}
              actionLabel={MESSAGES.RELOAD}
              actionIcon="refresh-cw"
              onAction={() => clients.refetch()}
            />
          ) : total === 0 ? (
            <EmptyState
              icon="users"
              title={cauta ? MESSAGES.EMPTY_FILTER : MESSAGES.EMPTY_CLIENTS}
            />
          ) : (
            <div className="clienti__table-scroll">
              <table className="clienti__table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Email</th>
                    <th className="clienti__num">Zi trimitere</th>
                    <th>Status</th>
                    <th>Activ</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.data!.map((c) => (
                    <tr
                      key={c.id}
                      className="clienti__row"
                      onClick={() => navigate(ROUTES.APP.CLIENT(c.id))}
                    >
                      <td>
                        <div className="clienti__client">
                          <Avatar initials={c.initials} size={34} tone="graphite" />
                          {/* Numele e focusabil pentru navigare la tastatura (a11y). */}
                          <button
                            className="clienti__name"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(ROUTES.APP.CLIENT(c.id));
                            }}
                          >
                            {c.nume}
                          </button>
                        </div>
                      </td>
                      <td className="clienti__email">{c.email}</td>
                      <td className="clienti__num clienti__mono">ziua {c.zi_trimitere}</td>
                      <td>
                        <StatusPill status={c.currentStatus} />
                      </td>
                      <td>
                        <Badge variant={c.activ ? "success" : "neutral"}>
                          {c.activ ? "Activ" : "Inactiv"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <ClientFormModal mode="add" open={addOpen} onClose={() => setAddOpen(false)} />
    </PageShell>
  );
}
