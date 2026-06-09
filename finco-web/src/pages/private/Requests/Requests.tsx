import { useSearchParams } from "react-router-dom";
import { Card, Tabs, type TabItem, SkeletonRows, EmptyState } from "@components";
import { RequestRow } from "@features/private/Requests/RequestRow";
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
  const requests = useDocumentRequests();
  const all = requests.data ?? [];

  const setTab = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete("tab");
    else next.set("tab", value);
    setParams(next, { replace: true });
  };

  const tabs: TabItem[] = [
    { value: "all", label: "Toate", count: all.length },
    { value: "automat", label: "Lunar automat", count: all.filter((r) => requestType(r) === "automat").length },
    { value: "custom", label: "Custom (angajat)", count: all.filter((r) => requestType(r) === "custom").length },
    { value: "public", label: "Public (re-cerere)", count: all.filter((r) => requestType(r) === "public").length },
    { value: "failed", label: "Esuate", count: all.filter((r) => !r.email_trimis).length },
  ];

  const filtered = all.filter((r) => matchesTab(r, tab));

  return (
    <PageShell title="Cereri trimise" subtitle="Istoricul email-urilor cu link de upload.">
      <div className="requests">
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
                    <RequestRow key={r.id} request={r} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
      </div>
    </PageShell>
  );
}
