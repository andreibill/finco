import { Modal, Button, Icon, Badge, useToast } from "@components";
import { useRetryRequest } from "@hooks/useDocumentRequests";
import { requestType } from "@utils/format";
import type { DocumentRequest, RequestType } from "@types";
import "./RequestDetailModal.css";

// Etichete prietenoase pentru tipul cererii (acelasi vocabular ca tab-urile).
const TYPE_LABELS: Record<RequestType, string> = {
  automat: "Lunar automat",
  custom: "Custom (angajat)",
  public: "Public (re-cerere)",
};

type RequestDetailModalProps = {
  // Cererea selectata; null = modal inchis.
  request: DocumentRequest | null;
  onClose: () => void;
};

// Detaliile complete ale unei cereri: status, metadate si textul mesajului
// (lucruri ce nu incap in tabel). Pentru email-urile esuate ofera retrimitere.
export function RequestDetailModal({ request, onClose }: RequestDetailModalProps) {
  const { showToast } = useToast();
  const retry = useRetryRequest();

  const failed = request ? !request.email_trimis : false;

  const handleRetry = () => {
    if (!request) return;
    retry.mutate(request.id, {
      onSuccess: () => {
        showToast({ tone: "ok", title: "Email retrimis catre client." });
        onClose();
      },
      onError: (e) => showToast({ tone: "err", title: (e as Error).message }),
    });
  };

  return (
    <Modal
      open={request !== null}
      onClose={onClose}
      title="Detalii cerere"
      subtitle={request?.subiect}
      width={560}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Inchide
          </Button>
          {failed && (
            <Button variant="primary" iconLeft="refresh-cw" onClick={handleRetry} disabled={retry.isPending}>
              {retry.isPending ? "Se retrimite..." : "Retrimite email"}
            </Button>
          )}
        </>
      }
    >
      {request && (
        <div className="request-detail">
          {failed && request.eroare && (
            <div className="request-detail__error">
              <Icon name="alert-circle" size={16} />
              <span>Trimitere esuata: {request.eroare}</span>
            </div>
          )}

          <dl className="request-detail__meta">
            <div className="request-detail__row">
              <dt>Status</dt>
              <dd>
                {request.email_trimis ? (
                  <span className="request-detail__status request-detail__status--ok">
                    <Icon name="check-circle-2" size={15} /> Trimis
                  </span>
                ) : (
                  <span className="request-detail__status request-detail__status--err">
                    <Icon name="alert-circle" size={15} /> Esuat
                  </span>
                )}
              </dd>
            </div>
            <div className="request-detail__row">
              <dt>Client</dt>
              <dd>{request.client}</dd>
            </div>
            <div className="request-detail__row">
              <dt>Perioada</dt>
              <dd>
                <Badge variant="mono">{request.period}</Badge>
              </dd>
            </div>
            <div className="request-detail__row">
              <dt>Tip</dt>
              <dd>{TYPE_LABELS[requestType(request)]}</dd>
            </div>
            <div className="request-detail__row">
              <dt>Trimis de</dt>
              <dd>{request.created_by}</dd>
            </div>
            <div className="request-detail__row">
              <dt>Data</dt>
              <dd>{request.created}</dd>
            </div>
          </dl>

          <div className="request-detail__message">
            <span className="request-detail__message-label">Mesaj</span>
            <p className="request-detail__message-body">{request.mesaj ?? "Fara mesaj."}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
