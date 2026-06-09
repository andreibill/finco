import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Avatar, Icon, IconButton, Button, Badge, StatusPill, SkeletonRows, EmptyState, useToast } from "@components";
import { ClientFormModal } from "@components/modals/ClientFormModal/ClientFormModal";
import { ConfirmDialog } from "@components/modals/ConfirmDialog/ConfirmDialog";
import { PageShell } from "@surfaces/InternalApp/PageShell";
import { useClient, useClientPeriods, useSetClientActive } from "@hooks/useClients";
import { useDocumentRequests } from "@hooks/useDocumentRequests";
import { useRequestModal } from "@contexts/RequestModalContext";
import { requestType } from "@utils/format";
import { ROUTES } from "@constants/routes";
import { MESSAGES } from "@constants/messages";
import "./ClientDetail.css";

export function ClientDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { openRequestModal } = useRequestModal();
  const { showToast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  // Dialog de confirmare pentru dezactivare (activarea se face direct).
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const client = useClient(id);
  const periods = useClientPeriods(id);
  const requests = useDocumentRequests();
  const setActive = useSetClientActive();

  // Nu stergem niciodata un client (audit): il dezactivam. Un client inactiv e
  // tratat ca neinregistrat — nu poate cere sau primi link-uri de upload.
  const toggleActive = async (activ: boolean) => {
    if (!client.data) return;
    try {
      await setActive.mutateAsync({ id, activ });
      showToast({
        tone: "ok",
        title: activ ? MESSAGES.CLIENT_ACTIVATED : MESSAGES.CLIENT_DEACTIVATED,
        body: client.data.nume,
      });
      setConfirmDeactivate(false);
    } catch (e) {
      showToast({ tone: "err", title: e instanceof Error ? e.message : MESSAGES.LOAD_ERROR });
    }
  };

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      showToast({ tone: "ok", title: "Email copiat" });
    } catch {
      showToast({ tone: "err", title: "Nu am putut copia email-ul" });
    }
  };

  const toClienti = () => navigate(ROUTES.APP.CLIENTI);

  if (client.isLoading) {
    return (
      <PageShell title="Client" breadcrumbs={[{ label: "Clienti", onClick: toClienti }]}>
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
      <PageShell title="Client" breadcrumbs={[{ label: "Clienti", onClick: toClienti }]}>
        <div className="client-detail">
          <Card padding={0}>
            <EmptyState icon="alert-circle" title={MESSAGES.LOAD_ERROR} actionLabel={MESSAGES.RELOAD} actionIcon="refresh-cw" onAction={() => client.refetch()} />
          </Card>
        </div>
      </PageShell>
    );
  }

  const c = client.data;

  // Totaluri pe toata istoria clientului (din perioade).
  const nrPerioade = periods.data?.length ?? null;
  const totalFisiere = periods.data?.reduce((s, p) => s + p.numar_fisiere, 0) ?? null;

  // Ultimele cereri trimise acestui client (cele mai noi primele).
  const clientReqs = (requests.data ?? []).filter((r) => r.client_id === id);
  const recentReqs = clientReqs.slice(-5).reverse();

  return (
    <PageShell
      title={c.nume}
      breadcrumbs={[{ label: "Clienti", onClick: toClienti }, { label: c.nume }]}
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
              <Badge variant={c.activ ? "success" : "neutral"}>{c.activ ? "activ" : "inactiv"}</Badge>
            </div>
          </div>
          <div className="client-detail__actions">
            <Button variant="primary" iconLeft="folder-open" onClick={() => navigate(ROUTES.APP.BIBLIOTECA_CLIENT(c.id))}>
              Vezi biblioteca
            </Button>
            <Button variant="secondary" iconLeft="mail-plus" onClick={() => openRequestModal(c)}>
              Cere fisiere
            </Button>
            <Button variant="secondary" iconLeft="send" onClick={() => { window.location.href = `mailto:${c.email}`; }}>
              Trimite mail
            </Button>
            <Button variant="secondary" iconLeft="settings" onClick={() => setEditOpen(true)}>
              Editeaza
            </Button>
            {c.activ ? (
              <Button variant="danger-soft" iconLeft="user-x" onClick={() => setConfirmDeactivate(true)}>
                Dezactiveaza
              </Button>
            ) : (
              <Button
                variant="success-soft"
                iconLeft="user-check"
                disabled={setActive.isPending}
                onClick={() => void toggleActive(true)}
              >
                Activeaza
              </Button>
            )}
          </div>
        </Card>

        <div className="client-detail__grid">
          {/* Detalii client: profil + cadenta + totaluri istorice. */}
          <Card padding={20} className="client-detail__card">
            <h2 className="client-detail__card-title">Detalii client</h2>
            <dl className="client-detail__fields">
              <div className="client-detail__field">
                <dt>Email</dt>
                <dd className="client-detail__field-email">
                  <span>{c.email}</span>
                  <IconButton name="copy" label="Copiaza email" size={28} iconSize={15} onClick={() => void copyEmail(c.email)} />
                </dd>
              </div>
              <div className="client-detail__field">
                <dt>Trimitere lunara</dt>
                <dd>ziua {c.zi_trimitere}</dd>
              </div>
              <div className="client-detail__field">
                <dt>Status</dt>
                <dd>
                  <Badge variant={c.activ ? "success" : "neutral"}>{c.activ ? "activ" : "inactiv"}</Badge>
                </dd>
              </div>
              <div className="client-detail__field">
                <dt>Perioade</dt>
                <dd>{nrPerioade ?? "…"}</dd>
              </div>
              <div className="client-detail__field">
                <dt>Fisiere primite</dt>
                <dd>{totalFisiere ?? "…"}</dd>
              </div>
            </dl>
          </Card>

          {/* Luna curenta: unde se afla clientul in perioada curenta. */}
          <Card padding={20} className="client-detail__card">
            <h2 className="client-detail__card-title">Luna curenta</h2>
            <div className="client-detail__current">
              <StatusPill status={c.currentStatus} size="lg" />
              <div className="client-detail__current-stats">
                <div className="client-detail__stat">
                  <Icon name="file-archive" size={16} />
                  {c.currentFiles} fisiere
                </div>
                <div className="client-detail__stat">
                  <Icon name="clock" size={16} />
                  Ultim upload: {c.lastUpload ?? "—"}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Cereri recente: ultimele email-uri cu link de upload pentru client. */}
        <Card padding={20} className="client-detail__card">
          <div className="client-detail__card-head">
            <h2 className="client-detail__card-title">Cereri recente</h2>
            <Button
              variant="ghost"
              size="sm"
              iconRight="arrow-right"
              onClick={() => navigate(`${ROUTES.APP.CERERI}?client=${id}`)}
            >
              Vezi toate
            </Button>
          </div>

          {requests.isLoading ? (
            <SkeletonRows rows={3} />
          ) : requests.isError ? (
            <EmptyState icon="alert-circle" title={MESSAGES.LOAD_ERROR} actionLabel={MESSAGES.RELOAD} actionIcon="refresh-cw" onAction={() => requests.refetch()} />
          ) : recentReqs.length === 0 ? (
            <EmptyState icon="mail" title="Nicio cerere trimisa acestui client." />
          ) : (
            <ul className="client-detail__reqs">
              {recentReqs.map((r) => (
                <li key={r.id} className="client-detail__req">
                  <span className={`client-detail__req-status client-detail__req-status--${r.email_trimis ? "ok" : "err"}`} title={r.eroare}>
                    <Icon name={r.email_trimis ? "check-circle-2" : "alert-circle"} size={16} />
                  </span>
                  <div className="client-detail__req-main">
                    <div className="client-detail__req-subject">{r.subiect}</div>
                    <div className="client-detail__req-meta">
                      {r.created} · {r.created_by}
                    </div>
                  </div>
                  <Badge variant="mono">{requestType(r)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <ClientFormModal mode="edit" client={c} open={editOpen} onClose={() => setEditOpen(false)} />

        <ConfirmDialog
          open={confirmDeactivate}
          title="Dezactiveaza client"
          message={`${c.nume} nu va mai putea cere sau primi link-uri de upload si va fi tratat ca neinregistrat. Istoricul si fisierele raman pastrate. Il poti reactiva oricand.`}
          confirmLabel="Dezactiveaza"
          pendingLabel={MESSAGES.CLIENT_STATUS_UPDATING}
          tone="danger"
          pending={setActive.isPending}
          onConfirm={() => void toggleActive(false)}
          onClose={() => setConfirmDeactivate(false)}
        />
      </div>
    </PageShell>
  );
}
