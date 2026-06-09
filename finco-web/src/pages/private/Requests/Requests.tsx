import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, Tabs, type TabItem, SkeletonRows, EmptyState, Icon, PeriodFilter } from "@components";
import { RequestRow } from "@features/private/Requests/RequestRow";
import { RequestDetailModal } from "@features/private/Requests/RequestDetailModal";
import { useDocumentRequests } from "@hooks/useDocumentRequests";
import { PageShell } from "@surfaces/InternalApp/PageShell";
import { requestType } from "@utils/format";
import { MESSAGES } from "@constants/messages";
import type { DocumentRequest } from "@types";
import "./Requests.css";

type TabValue = "all" | "automat" | "custom" | "public" | "failed";

function matchesTab(r: DocumentRequest, tab: TabValue): boolean {
  switch (tab) {
    case "all":
      return true;
    case "automat":
      return requestType(r) === "automat";
    case "custom":
      return requestType(r) === "custom";
    case "public":
      return requestType(r) === "public";
    case "failed":
      return !r.email_trimis;
  }
}

export function Requests() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as TabValue) || "all";
  // Filtru optional pe un client (din pagina de detalii client: "Vezi toate").
  const clientId = params.get("client") ?? "";
  // Filtru optional pe o perioada (an_luna); gol = toate perioadele.
  const period = params.get("period") ?? "";
  // Cererea deschisa in modalul de detalii (null = inchis).
  const [selected, setSelected] = useState<DocumentRequest | null>(null);
  const requests = useDocumentRequests();
  const all = requests.data ?? [];
  const byClient = clientId ? all.filter((r) => r.client_id === clientId) : all;
  const clientName = clientId ? byClient[0]?.client ?? "client" : "";
  // Perioadele disponibile, ordonate descrescator (cele mai noi primele).
  const periodOptions = [...new Set(byClient.map((r) => r.period))].sort().reverse();
  // Setul curent = client + perioada; tab-urile si randurile se calculeaza peste el.
  const scoped = period ? byClient.filter((r) => r.period === period) : byClient;

  const setTab = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete("tab");
    else next.set("tab", value);
    setParams(next, { replace: true });
  };

  const setPeriod = (value: string) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete("period");
    else next.set("period", value);
    setParams(next, { replace: true });
  };

  const clearClient = () => {
    const next = new URLSearchParams(params);
    next.delete("client");
    setParams(next, { replace: true });
  };

  const tabs: TabItem[] = [
    { value: "all", label: "Toate", count: scoped.length },
    { value: "automat", label: "Lunar automat", count: scoped.filter((r) => requestType(r) === "automat").length },
    { value: "custom", label: "Custom (angajat)", count: scoped.filter((r) => requestType(r) === "custom").length },
    { value: "public", label: "Public (re-cerere)", count: scoped.filter((r) => requestType(r) === "public").length },
    { value: "failed", label: "Esuate", count: scoped.filter((r) => !r.email_trimis).length },
  ];

  const filtered = scoped.filter((r) => matchesTab(r, tab));

  return (
    <PageShell title="Cereri trimise" subtitle="Istoricul email-urilor cu link de upload.">
      <div className="requests">
      <div className="requests__toolbar">
        {clientId && (
          <div className="requests__client-filter">
            <Icon name="filter" size={14} />
            <span>Cereri pentru: <strong>{clientName}</strong></span>
            <button type="button" className="requests__client-filter-clear" onClick={clearClient} aria-label="Elimina filtrul">
              <Icon name="x" size={14} />
            </button>
          </div>
        )}
        <PeriodFilter value={period} options={periodOptions} onChange={setPeriod} allLabel="Toate perioadele" />
      </div>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      <div className="requests__table-wrap">
        <Card padding={0}>
          {requests.isLoading ? (
            <SkeletonRows rows={6} />
          ) : requests.isError ? (
            <EmptyState icon="alert-circle" title={MESSAGES.LOAD_ERROR} actionLabel={MESSAGES.RELOAD} actionIcon="refresh-cw" onAction={() => requests.refetch()} />
          ) : filtered.length === 0 ? (
            <EmptyState icon="mail" title="Nicio cerere in aceasta categorie." />
          ) : (
            <div className="requests__scroll">
              <table className="requests__table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Client</th>
                    <th>Subiect</th>
                    <th>Perioada</th>
                    <th>Tip</th>
                    <th>Trimis de</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <RequestRow key={r.id} request={r} onClick={setSelected} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
      </div>
      <RequestDetailModal request={selected} onClose={() => setSelected(null)} />
    </PageShell>
  );
}
