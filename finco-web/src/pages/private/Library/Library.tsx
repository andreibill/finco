import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Input, Button, SkeletonRows, EmptyState, PeriodFilter } from "@components";
import { ClientFormModal } from "@components/modals/ClientFormModal/ClientFormModal";
import { KpiCard } from "@features/private/Library/KpiCard";
import { SegmentedFilter } from "@features/private/Library/SegmentedFilter";
import { ClientRow } from "@features/private/Library/ClientRow";
import { PageShell } from "@surfaces/InternalApp/PageShell";
import { useAllClients, useClients, useAvailablePeriods } from "@hooks/useClients";
import { useRequestModal } from "@contexts/RequestModalContext";
import { useBibliotecaPeriod } from "@contexts/BibliotecaPeriodContext";
import { ROUTES } from "@constants/routes";
import { MESSAGES } from "@constants/messages";
import { formatPeriodLabel } from "@utils/format";
import "./Library.css";

export function Library() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { openRequestModal } = useRequestModal();
  const { period, setPeriod } = useBibliotecaPeriod();
  const [addOpen, setAddOpen] = useState(false);

  const cauta = params.get("cauta") ?? "";
  const status = params.get("status") ?? "all";
  const periodLabel = formatPeriodLabel(period);

  const filtered = useClients({ cauta, status, period });
  const all = useAllClients(period);
  const availablePeriods = useAvailablePeriods();
  const periodOptions = availablePeriods.data?.length ? availablePeriods.data : [period];

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
      right={<PeriodFilter value={period} options={periodOptions} onChange={setPeriod} />}
    >
      <div className="library">
      <div className="library__kpis">
        <KpiCard icon="check-circle-2" tone="complete" label="Clienti incarcat" value={kpis.complete} total={kpis.total} hint="Perioada finalizata" />
        <KpiCard icon="clock" tone="partial" label="Partial" value={kpis.partial} total={kpis.total} hint="Au incarcat, neinchis" />
        <KpiCard icon="alert-circle" tone="empty" label="Fara upload" value={kpis.empty} total={kpis.total} hint="Nu au incarcat inca" />
        <KpiCard icon="file-archive" tone="brand" label="Fisiere primite" value={kpis.files} hint={`In perioada ${periodLabel}`} />
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
                  <th>Ultim upload</th>
                  <th>Fisiere</th>
                  <th>Link</th>
                  <th>Status {periodLabel}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.data!.map((c) => (
                  <ClientRow
                    key={c.id}
                    client={c}
                    onOpen={() => navigate(ROUTES.APP.BIBLIOTECA_CLIENT(c.id))}
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
