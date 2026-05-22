import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../components/Card/Card";
import { Icon } from "../../components/Icon/Icon";
import { Badge } from "../../components/Badge/Badge";
import { StatusPill } from "../../components/StatusPill/StatusPill";
import { Button } from "../../components/Button/Button";
import { SkeletonRows } from "../../components/Skeleton/Skeleton";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { LotGroup } from "./LotGroup";
import { PageShell } from "../../surfaces/InternalApp/PageShell";
import { ROUTES } from "../../constants/routes";
import { useClient, useClientPeriods } from "../../hooks/useClients";
import { usePeriodFiles, useMarkFinalizat, useDownloadPeriod } from "../../hooks/usePeriods";
import { useRequestModal } from "../../contexts/RequestModalContext";
import { useToast } from "../../components/ToastProvider/ToastProvider";
import { formatPeriodLabel } from "../../utils/format";
import { MESSAGES } from "../../constants/messages";
import type { FileItem } from "../../types";
import "./PeriodDetailScreen.css";

export function PeriodDetailScreen() {
  const { id = "", periodId = "" } = useParams();
  const navigate = useNavigate();
  const { openRequestModal } = useRequestModal();
  const { showToast } = useToast();

  const client = useClient(id);
  const periods = useClientPeriods(id);
  const files = usePeriodFiles(periodId);
  const markFinalizat = useMarkFinalizat(id);
  const downloadPeriod = useDownloadPeriod();

  const period = periods.data?.find((p) => p.id === periodId);

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

  const monthLabel = period ? formatPeriodLabel(period.an_luna) : "";
  const fileCount = files.data?.length ?? 0;

  const onMark = async () => {
    try {
      await markFinalizat.mutateAsync(periodId);
      showToast({ tone: "ok", title: MESSAGES.PERIOD_FINALIZED, body: `${monthLabel} este inchisa.` });
    } catch (e) {
      showToast({ tone: "err", title: e instanceof Error ? e.message : "Eroare." });
    }
  };

  const onDownloadZip = async () => {
    await downloadPeriod.mutateAsync({ id: periodId });
    showToast({ tone: "info", title: "Descarcare pregatita." });
  };

  const toBiblioteca = () => navigate(ROUTES.APP.BIBLIOTECA);
  const toClient = () => navigate(ROUTES.APP.CLIENT(id));

  return (
    <PageShell
      title={`Perioada ${monthLabel || "..."}`}
      breadcrumbs={[
        { label: "Biblioteca", onClick: toBiblioteca },
        { label: client.data?.nume ?? "Client", onClick: toClient },
        { label: period?.an_luna ?? "" },
      ]}
      right={
        <Button variant="ghost" iconLeft="arrow-left" size="sm" onClick={toClient}>
          Inapoi
        </Button>
      }
    >
      <div className="period-detail">
      <Card padding={20} className="period-detail__header">
        <span className="period-detail__folder">
          <Icon name="folder-open" size={26} />
        </span>
        <div className="period-detail__info">
          <div className="period-detail__title-line">
            <h2 className="period-detail__title">Perioada {monthLabel || "..."}</h2>
            {period && <Badge variant="mono">{period.an_luna}</Badge>}
            {period && <StatusPill status={period.status} size="lg" />}
          </div>
          <div className="period-detail__meta">
            {client.data && <span>{client.data.nume}</span>}
            <span>{fileCount} fisiere primite</span>
            <span>
              {lots.length} lot{lots.length === 1 ? "" : "uri"} de upload
            </span>
            {period?.last_upload && <span className="period-detail__mono">ultim upload {period.last_upload}</span>}
          </div>
        </div>
        <div className="period-detail__actions">
          <Button variant="secondary" iconLeft="download" onClick={() => void onDownloadZip()}>
            Descarca ZIP
          </Button>
          {client.data && (
            <Button variant="secondary" iconLeft="mail-plus" onClick={() => openRequestModal(client.data!)}>
              Cere fisiere
            </Button>
          )}
          {period && !period.finalizat && (
            <Button variant="primary" iconLeft="check" onClick={() => void onMark()} disabled={markFinalizat.isPending}>
              {markFinalizat.isPending ? "Se salveaza..." : "Marcheaza ca finalizat"}
            </Button>
          )}
        </div>
      </Card>

      {files.isLoading ? (
        <Card padding={0}>
          <SkeletonRows rows={4} />
        </Card>
      ) : files.isError ? (
        <Card padding={0}>
          <EmptyState icon="alert-circle" title={MESSAGES.LOAD_ERROR} actionLabel={MESSAGES.RELOAD} actionIcon="refresh-cw" onAction={() => files.refetch()} />
        </Card>
      ) : fileCount === 0 ? (
        <Card padding={0}>
          <EmptyState
            icon="folder-open"
            title="Niciun upload pentru aceasta perioada"
            message={`Clientul nu a incarcat inca fisierele lunii ${monthLabel}.`}
            actionLabel="Cere fisiere"
            actionIcon="mail-plus"
            onAction={() => client.data && openRequestModal(client.data)}
          />
        </Card>
      ) : (
        lots.map((g) => <LotGroup key={g.lot} lot={g.lot} files={g.items} periodId={periodId} />)
      )}
      </div>
    </PageShell>
  );
}
