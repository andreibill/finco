import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../../components/Card/Card";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { SkeletonRows } from "../../components/Skeleton/Skeleton";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { KpiCard } from "./KpiCard";
import { SegmentedFilter } from "./SegmentedFilter";
import { ClientRow } from "./ClientRow";
import { ClientFormModal } from "../ClientFormModal/ClientFormModal";
import { PageShell } from "../../surfaces/InternalApp/PageShell";
import { useAllClients, useClients } from "../../hooks/useClients";
import { useRequestModal } from "../../contexts/RequestModalContext";
import { ROUTES } from "../../constants/routes";
import { MESSAGES } from "../../constants/messages";
import { CURRENT_PERIOD, CURRENT_PERIOD_LABEL } from "../../mocks/fixtures";
import "./LibraryScreen.css";

export function LibraryScreen() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { openRequestModal } = useRequestModal();
  const [addOpen, setAddOpen] = useState(false);

  const cauta = params.get("cauta") ?? "";
  const status = params.get("status") ?? "all";

  const filtered = useClients({ cauta, status });
  const all = useAllClients();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || (key === "status" && value === "all")) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const kpis = useMemo(() => {
    const clients = all.data ?? [];
    const total = clients.length;
    const complete = clients.filter((c) => c.currentStatus === "complete").length;
    const partial = clients.filter((c) => c.currentStatus === "partial").length;
    const empty = clients.filter((c) => c.currentStatus === "empty").length;
    const files = clients.reduce((s, c) => s + c.currentFiles, 0);
    return { total, complete, partial, empty, files };
  }, [all.data]);

  return (
    <PageShell
      title="Biblioteca"
      subtitle={`Perioada curenta: ${CURRENT_PERIOD_LABEL}`}
      right={
        <Button variant="ghost" iconLeft="bell" size="sm">
          Notificari
        </Button>
      }
    >
      <div className="library">
      <div className="library__kpis">
        <KpiCard icon="check-circle-2" tone="complete" label="Clienti incarcat" value={kpis.complete} total={kpis.total} hint="Perioada finalizata" />
        <KpiCard icon="clock" tone="partial" label="Partial" value={kpis.partial} total={kpis.total} hint="Au incarcat, neinchis" />
        <KpiCard icon="alert-circle" tone="empty" label="Fara upload" value={kpis.empty} total={kpis.total} hint="Nu au incarcat inca" />
        <KpiCard icon="file-archive" tone="brand" label="Fisiere primite" value={kpis.files} hint={`In perioada ${CURRENT_PERIOD}`} />
      </div>

      <div className="library__toolbar">
        <div className="library__search">
          <Input value={cauta} onChange={(v) => setParam("cauta", v)} placeholder="Cauta clienti dupa nume sau email" iconLeft="search" />
        </div>
        <SegmentedFilter value={status} onChange={(v) => setParam("status", v)} />
        <div className="library__spacer" />
        <Button variant="secondary" iconLeft="user-plus" onClick={() => setAddOpen(true)}>
          Adauga client
        </Button>
        <Button variant="primary" iconLeft="mail-plus" onClick={() => openRequestModal(null)}>
          Cere fisiere
        </Button>
      </div>

      <Card padding={0} className="library__table-card">
        {filtered.isLoading ? (
          <SkeletonRows rows={6} />
        ) : filtered.isError ? (
          <EmptyState icon="alert-circle" title={MESSAGES.LOAD_ERROR} actionLabel={MESSAGES.RELOAD} actionIcon="refresh-cw" onAction={() => filtered.refetch()} />
        ) : (filtered.data?.length ?? 0) === 0 ? (
          <EmptyState
            icon="users"
            title={cauta || status !== "all" ? MESSAGES.EMPTY_FILTER : MESSAGES.EMPTY_CLIENTS}
            message={cauta || status !== "all" ? undefined : "Adaugati primul client pentru a incepe."}
            actionLabel={cauta || status !== "all" ? undefined : "Adauga client"}
            actionIcon="user-plus"
            onAction={cauta || status !== "all" ? undefined : () => setAddOpen(true)}
          />
        ) : (
          <div className="library__table-scroll">
            <table className="library__table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Status {CURRENT_PERIOD_LABEL}</th>
                  <th>Ultim upload</th>
                  <th className="library__num">Fisiere</th>
                  <th className="library__num">Zi trimitere</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.data!.map((c) => (
                  <ClientRow
                    key={c.id}
                    client={c}
                    onOpen={() => navigate(ROUTES.APP.CLIENT(c.id))}
                    onRequest={() => openRequestModal(c)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ClientFormModal mode="add" open={addOpen} onClose={() => setAddOpen(false)} />
      </div>
    </PageShell>
  );
}
