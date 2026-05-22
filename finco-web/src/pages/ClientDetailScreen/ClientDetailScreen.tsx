import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../components/Card/Card";
import { Avatar } from "../../components/Avatar/Avatar";
import { Icon } from "../../components/Icon/Icon";
import { Button } from "../../components/Button/Button";
import { SkeletonRows } from "../../components/Skeleton/Skeleton";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { PeriodRow } from "./PeriodRow";
import { ClientFormModal } from "../ClientFormModal/ClientFormModal";
import { PageShell } from "../../surfaces/InternalApp/PageShell";
import { useClient, useClientPeriods } from "../../hooks/useClients";
import { useRequestModal } from "../../contexts/RequestModalContext";
import { ROUTES } from "../../constants/routes";
import { MESSAGES } from "../../constants/messages";
import "./ClientDetailScreen.css";

export function ClientDetailScreen() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { openRequestModal } = useRequestModal();
  const [editOpen, setEditOpen] = useState(false);

  const client = useClient(id);
  const periods = useClientPeriods(id);

  const toBiblioteca = () => navigate(ROUTES.APP.BIBLIOTECA);
  const backBtn = (
    <Button variant="ghost" iconLeft="arrow-left" size="sm" onClick={toBiblioteca}>
      Inapoi
    </Button>
  );

  if (client.isLoading) {
    return (
      <PageShell title="Client" breadcrumbs={[{ label: "Biblioteca", onClick: toBiblioteca }]} right={backBtn}>
        <div className="client-detail">
          <Card>
            <SkeletonRows rows={3} />
          </Card>
        </div>
      </PageShell>
    );
  }

  if (client.isError || !client.data) {
    return (
      <PageShell title="Client" breadcrumbs={[{ label: "Biblioteca", onClick: toBiblioteca }]} right={backBtn}>
        <div className="client-detail">
          <Card padding={0}>
            <EmptyState icon="alert-circle" title={MESSAGES.LOAD_ERROR} actionLabel={MESSAGES.RELOAD} actionIcon="refresh-cw" onAction={() => client.refetch()} />
          </Card>
        </div>
      </PageShell>
    );
  }

  const c = client.data;

  return (
    <PageShell
      title={c.nume}
      breadcrumbs={[{ label: "Biblioteca", onClick: toBiblioteca }, { label: c.nume }]}
      right={backBtn}
    >
      <div className="client-detail">
      <Card padding={20} className="client-detail__header">
        <Avatar initials={c.initials} size={56} tone="graphite" />
        <div className="client-detail__info">
          <div className="client-detail__name">{c.nume}</div>
          <div className="client-detail__meta">
            <span className="client-detail__meta-item">
              <Icon name="mail" size={14} />
              {c.email}
            </span>
            <span className="client-detail__meta-item">
              <Icon name="clock" size={14} />
              trimitere lunara: ziua {c.zi_trimitere}
            </span>
            <span className="client-detail__meta-item">{c.activ ? "activ" : "inactiv"}</span>
          </div>
        </div>
        <div className="client-detail__actions">
          <Button variant="secondary" iconLeft="settings" onClick={() => setEditOpen(true)}>
            Editeaza
          </Button>
          <Button variant="primary" iconLeft="mail-plus" onClick={() => openRequestModal(c)}>
            Cere fisiere
          </Button>
        </div>
      </Card>

      <div className="client-detail__list-head">
        <h2 className="client-detail__list-title">Perioade</h2>
        <span className="client-detail__count">{periods.data?.length ?? 0} perioade</span>
      </div>

      {periods.isLoading ? (
        <Card padding={0}>
          <SkeletonRows rows={3} />
        </Card>
      ) : periods.isError ? (
        <Card padding={0}>
          <EmptyState icon="alert-circle" title={MESSAGES.LOAD_ERROR} actionLabel={MESSAGES.RELOAD} actionIcon="refresh-cw" onAction={() => periods.refetch()} />
        </Card>
      ) : (
        <div className="client-detail__periods">
          {periods.data!.map((p) => (
            <PeriodRow key={p.id} period={p} onOpen={() => navigate(ROUTES.APP.PERIOD(c.id, p.id))} />
          ))}
        </div>
      )}

      <ClientFormModal mode="edit" client={c} open={editOpen} onClose={() => setEditOpen(false)} />
      </div>
    </PageShell>
  );
}
