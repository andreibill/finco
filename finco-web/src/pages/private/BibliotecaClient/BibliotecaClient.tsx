import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, Avatar, Icon, IconButton, Button, StatusPill, LinkStatusTag, Tabs, Tooltip, PeriodFilter, SkeletonRows, EmptyState, useToast } from "@components";
import { LotGroup } from "@features/private/PeriodDetail/LotGroup";
import { FileTable } from "@features/private/PeriodDetail/FileTable";
import { FileBulkBar } from "@features/private/PeriodDetail/FileBulkBar";
import { FileSelectionProvider } from "@features/private/PeriodDetail/FileSelectionContext";
import { PageShell } from "@surfaces/InternalApp/PageShell";
import { useClient, useClientPeriods, useAvailablePeriods } from "@hooks/useClients";
import { usePeriodFiles, useMarkFinalizat, useDownloadPeriod } from "@hooks/usePeriods";
import { useDocumentRequests } from "@hooks/useDocumentRequests";
import { useRequestModal } from "@contexts/RequestModalContext";
import { useBibliotecaPeriod } from "@contexts/BibliotecaPeriodContext";
import { ROUTES } from "@constants/routes";
import { MESSAGES } from "@constants/messages";
import {
  FILE_VIEWS,
  DEFAULT_FILE_SORT,
  DEFAULT_SORT_DIR,
  sortFiles,
  type FileView,
  type FileSortKey,
  type SortDir,
} from "@constants/files";
import { formatPeriodLabel, linkStatusFrom } from "@utils/format";
import type { FileItem } from "@types";
import "./BibliotecaClient.css";

// Optiunile vederii fisierelor: grupate pe lot (arhiva) sau lista plata sortabila.
const VIEW_TABS = [
  { value: FILE_VIEWS.LOT, label: "Pe lot" },
  { value: FILE_VIEWS.ALL, label: "Toate fisierele" },
];

// Biblioteca pe client: fisierele clientului pentru perioada selectata. Perioada
// e partajata cu lista (BibliotecaPeriodContext) — o schimbi aici sau in lista si
// se reflecta peste tot. Gestionarea clientului (editare, dezactivare) sta pe
// pagina lui din Clienti, accesibila prin "Gestioneaza client".
export function BibliotecaClient() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { openRequestModal } = useRequestModal();
  const { period, setPeriod } = useBibliotecaPeriod();
  const { showToast } = useToast();

  const client = useClient(id);
  const periods = useClientPeriods(id);
  const availablePeriods = useAvailablePeriods();
  const requests = useDocumentRequests();
  const periodOptions = availablePeriods.data?.length ? availablePeriods.data : [period];

  // Perioada selectata din istoricul clientului (poate lipsi: fara upload luna asta).
  const periodRecord = periods.data?.find((p) => p.an_luna === period);
  const periodId = periodRecord?.id ?? "";
  const files = usePeriodFiles(periodId);
  const markFinalizat = useMarkFinalizat(id);
  const downloadPeriod = useDownloadPeriod();

  const periodLabel = formatPeriodLabel(period);
  const fileCount = files.data?.length ?? 0;

  // Vedere + sortare traiesc in URL (sursa de adevar; ?vedere / ?sort / ?dir).
  const view: FileView = params.get("vedere") === FILE_VIEWS.ALL ? FILE_VIEWS.ALL : FILE_VIEWS.LOT;
  const sortKey = (params.get("sort") as FileSortKey) || DEFAULT_FILE_SORT;
  const dir: SortDir = params.get("dir") === "desc" ? "desc" : DEFAULT_SORT_DIR;

  const setParam = (key: string, value: string, isDefault: boolean) => {
    const next = new URLSearchParams(params);
    if (isDefault) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const onSort = (key: FileSortKey) => {
    // Acelasi cap de coloana inverseaza directia; o coloana noua porneste crescator.
    const nextDir: SortDir = key === sortKey && dir === "asc" ? "desc" : "asc";
    const next = new URLSearchParams(params);
    next.set("sort", key);
    if (nextDir === DEFAULT_SORT_DIR) next.delete("dir");
    else next.set("dir", nextDir);
    setParams(next, { replace: true });
  };

  // Statusul linkului pentru clientul + perioada afisata (derivat din cereri).
  const linkStatus = useMemo(() => {
    const reqs = (requests.data ?? []).filter((r) => r.client_id === id && r.period === period);
    return linkStatusFrom(reqs);
  }, [requests.data, id, period]);

  // Grupeaza fisierele pe lot; cheile crescator.
  const lots = useMemo(() => {
    const map: Record<number, FileItem[]> = {};
    (files.data ?? []).forEach((f) => {
      (map[f.lot] = map[f.lot] || []).push(f);
    });
    return Object.keys(map)
      .map(Number)
      .sort((a, b) => a - b)
      .map((lot) => ({ lot, items: map[lot] }));
  }, [files.data]);

  // Lista plata sortata pentru vederea "toate fisierele".
  const sortedFiles = useMemo(() => sortFiles(files.data ?? [], sortKey, dir), [files.data, sortKey, dir]);

  const onMark = async () => {
    if (!periodId) return;
    try {
      await markFinalizat.mutateAsync(periodId);
      showToast({ tone: "ok", title: MESSAGES.PERIOD_FINALIZED, body: `${periodLabel} este inchisa.` });
    } catch (e) {
      showToast({ tone: "err", title: e instanceof Error ? e.message : MESSAGES.LOAD_ERROR });
    }
  };

  const onDownloadZip = async () => {
    if (!periodId) return;
    await downloadPeriod.mutateAsync({ id: periodId });
    showToast({ tone: "info", title: "Descarcare pregatita." });
  };

  const toBiblioteca = () => navigate(ROUTES.APP.BIBLIOTECA);

  if (client.isLoading) {
    return (
      <PageShell title="Client" breadcrumbs={[{ label: "Biblioteca", onClick: toBiblioteca }]}>
        <div className="biblioteca-client">
          <Card>
            <SkeletonRows rows={3} />
          </Card>
        </div>
      </PageShell>
    );
  }

  if (client.isError || !client.data) {
    return (
      <PageShell title="Client" breadcrumbs={[{ label: "Biblioteca", onClick: toBiblioteca }]}>
        <div className="biblioteca-client">
          <Card padding={0}>
            <EmptyState icon="alert-circle" title={MESSAGES.LOAD_ERROR} actionLabel={MESSAGES.RELOAD} actionIcon="refresh-cw" onAction={() => client.refetch()} />
          </Card>
        </div>
      </PageShell>
    );
  }

  const c = client.data;

  // Empty state comun: clientul nu are upload in perioada selectata.
  const emptyForPeriod = (
    <Card padding={0}>
      <EmptyState
        icon="folder-open"
        title={`Niciun upload pentru ${periodLabel}`}
        message="Clientul nu a incarcat fisiere in aceasta perioada."
        actionLabel="Cere fisiere"
        actionIcon="mail-plus"
        onAction={() => openRequestModal(c)}
      />
    </Card>
  );

  return (
    <PageShell
      title={c.nume}
      breadcrumbs={[{ label: "Biblioteca", onClick: toBiblioteca }, { label: c.nume }]}
      right={<PeriodFilter value={period} options={periodOptions} onChange={setPeriod} />}
    >
      <div className="biblioteca-client">
      <Card padding={20} className="biblioteca-client__header">
        <div className="biblioteca-client__header-main">
          <Avatar initials={c.initials} size={56} tone="graphite" />
          <div className="biblioteca-client__info">
            <div className="biblioteca-client__name">{c.nume}</div>
            <div className="biblioteca-client__meta">
              <span className="biblioteca-client__meta-item">
                <Icon name="mail" size={14} />
                {c.email}
              </span>
              <span className="biblioteca-client__meta-item">
                <Icon name="clock" size={14} />
                trimitere lunara: ziua {c.zi_trimitere}
              </span>
              <span className="biblioteca-client__meta-item">{c.activ ? "activ" : "inactiv"}</span>
            </div>
          </div>
          <div className="biblioteca-client__actions">
            <Button variant="secondary" iconRight="arrow-right" onClick={() => navigate(ROUTES.APP.CLIENT(c.id))}>
              Gestioneaza client
            </Button>
            <Button variant="primary" iconLeft="mail-plus" onClick={() => openRequestModal(c)}>
              Cere fisiere
            </Button>
          </div>
        </div>

        {/* Sumarul perioadei selectate (acelasi set de coloane ca lista Biblioteca). */}
        <div className="biblioteca-client__stats">
          <div className="biblioteca-client__stat">
            <span className="biblioteca-client__stat-label">Ultim upload</span>
            <span className="biblioteca-client__stat-value biblioteca-client__stat-value--mono">
              {periodRecord?.last_upload || "—"}
            </span>
          </div>
          <div className="biblioteca-client__stat">
            <span className="biblioteca-client__stat-label">Fisiere</span>
            <span className="biblioteca-client__stat-value">
              {fileCount > 0 ? `${fileCount} fisiere` : "—"}
            </span>
          </div>
          <div className="biblioteca-client__stat">
            <span className="biblioteca-client__stat-label">Link</span>
            <span className="biblioteca-client__stat-value">
              <LinkStatusTag status={linkStatus} />
            </span>
          </div>
          <div className="biblioteca-client__stat">
            <span className="biblioteca-client__stat-label">Status {periodLabel}</span>
            <span className="biblioteca-client__stat-value">
              <StatusPill status={periodRecord?.status ?? "empty"} />
            </span>
          </div>
          {periodRecord && fileCount > 0 && (
            // Iconita de descarcare a intregii perioade (toate fisierele intr-un ZIP),
            // cu text explicativ la hover.
            <div className="biblioteca-client__stats-action">
              <Tooltip text={`Descarca toate cele ${fileCount} fisiere ale perioadei intr-o arhiva ZIP`} placement="left">
                <IconButton name="download" tone="brand-solid" label="Descarca toate fisierele" size={40} iconSize={18} onClick={() => void onDownloadZip()} />
              </Tooltip>
            </div>
          )}
        </div>
      </Card>

      {/* Provider de selectie, resetat la schimbarea perioadei (key=periodId). */}
      <FileSelectionProvider key={periodId}>
        {periodRecord && fileCount > 0 && (
          <div className="biblioteca-client__toolbar">
            <Tabs tabs={VIEW_TABS} value={view} onChange={(v) => setParam("vedere", v, v === FILE_VIEWS.LOT)} />
            <div className="biblioteca-client__toolbar-spacer" />
            {!periodRecord.finalizat && (
              <Button variant="primary" iconLeft="check" disabled={markFinalizat.isPending} onClick={() => void onMark()}>
                {markFinalizat.isPending ? "Se salveaza..." : "Marcheaza finalizat"}
              </Button>
            )}
          </div>
        )}

        {periodRecord && fileCount > 0 && !files.isLoading && !files.isError && (
          <FileBulkBar files={files.data!} periodId={periodId} />
        )}

        {periods.isLoading ? (
          <Card padding={0}>
            <SkeletonRows rows={4} />
          </Card>
        ) : periods.isError ? (
          <Card padding={0}>
            <EmptyState icon="alert-circle" title={MESSAGES.LOAD_ERROR} actionLabel={MESSAGES.RELOAD} actionIcon="refresh-cw" onAction={() => periods.refetch()} />
          </Card>
        ) : !periodRecord ? (
          emptyForPeriod
        ) : files.isLoading ? (
          <Card padding={0}>
            <SkeletonRows rows={4} />
          </Card>
        ) : files.isError ? (
          <Card padding={0}>
            <EmptyState icon="alert-circle" title={MESSAGES.LOAD_ERROR} actionLabel={MESSAGES.RELOAD} actionIcon="refresh-cw" onAction={() => files.refetch()} />
          </Card>
        ) : fileCount === 0 ? (
          emptyForPeriod
        ) : view === FILE_VIEWS.ALL ? (
          <FileTable files={sortedFiles} periodId={periodId} sortKey={sortKey} dir={dir} onSort={onSort} />
        ) : (
          <div className="biblioteca-client__lots">
            {lots.map((g) => (
              <LotGroup key={g.lot} lot={g.lot} files={g.items} periodId={periodId} />
            ))}
          </div>
        )}
      </FileSelectionProvider>
      </div>
    </PageShell>
  );
}
