import { useEffect, useState } from "react";
import { Modal } from "../../components/Modal/Modal";
import { Field } from "../../components/Field/Field";
import { Input } from "../../components/Input/Input";
import { Textarea } from "../../components/Textarea/Textarea";
import { Button } from "../../components/Button/Button";
import { Avatar } from "../../components/Avatar/Avatar";
import { Badge } from "../../components/Badge/Badge";
import { Icon } from "../../components/Icon/Icon";
import { ClientPicker } from "./ClientPicker";
import { useCreateRequest } from "../../hooks/useDocumentRequests";
import { useToast } from "../../components/ToastProvider/ToastProvider";
import { CURRENT_PERIOD, CURRENT_PERIOD_LABEL } from "../../mocks/fixtures";
import { LINK_VALID_ZILE } from "../../constants/upload";
import { MESSAGES } from "../../constants/messages";
import type { Client } from "../../types";
import "./RequestDocumentsModal.css";

export type RequestDocumentsModalProps = {
  open: boolean;
  client: Client | null; // null = se alege din lista
  onClose: () => void;
};

export function RequestDocumentsModal({ open, client, onClose }: RequestDocumentsModalProps) {
  const createRequest = useCreateRequest();
  const { showToast } = useToast();
  const [chosen, setChosen] = useState<Client | null>(client);
  const [subiect, setSubiect] = useState("");
  const [mesaj, setMesaj] = useState("");

  useEffect(() => {
    if (!open) return;
    setChosen(client);
    setSubiect(`[FINCO] Fisiere suplimentare — ${CURRENT_PERIOD_LABEL}`);
    setMesaj(
      `Buna ziua,\n\nVa rugam sa incarcati prin linkul atasat fisierele lipsa pentru luna ${CURRENT_PERIOD_LABEL}.\n\nMultumim,\nCabinetul.`,
    );
  }, [open, client]);

  const canSend = !!chosen && subiect.trim().length > 0 && !createRequest.isPending;

  const send = async () => {
    if (!chosen) return;
    try {
      await createRequest.mutateAsync({ client_id: chosen.id, subiect, mesaj });
      showToast({ tone: "ok", title: MESSAGES.REQUEST_SENT, body: `Email trimis catre ${chosen.email}.` });
      onClose();
    } catch (e) {
      showToast({ tone: "err", title: e instanceof Error ? e.message : "Trimitere esuata." });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cere fisiere"
      subtitle={chosen ? `Trimite link nou catre ${chosen.nume}.` : "Selecteaza un client si compune mesajul."}
      width={560}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Anuleaza
          </Button>
          <Button variant="primary" iconLeft="mail-plus" onClick={() => void send()} disabled={!canSend}>
            {createRequest.isPending ? MESSAGES.REQUEST_SENDING : "Trimite link"}
          </Button>
        </>
      }
    >
      <div className="request-modal">
        {!client && (
          <Field label="Client">{() => <ClientPicker value={chosen} onChange={setChosen} />}</Field>
        )}
        {chosen && (
          <div className="request-modal__client">
            <Avatar initials={chosen.initials} size={36} tone="graphite" />
            <div className="request-modal__client-info">
              <div className="request-modal__client-name">{chosen.nume}</div>
              <div className="request-modal__client-email">{chosen.email}</div>
            </div>
            <Badge variant="mono">{CURRENT_PERIOD}</Badge>
          </div>
        )}
        <Field label="Subiect">{({ inputId }) => <Input id={inputId} value={subiect} onChange={setSubiect} />}</Field>
        <Field label="Mesaj" hint="Linkul de upload se ataseaza automat la finalul mesajului.">
          {({ inputId, describedBy }) => (
            <Textarea id={inputId} ariaDescribedBy={describedBy} value={mesaj} onChange={setMesaj} rows={6} />
          )}
        </Field>
        <div className="request-modal__banner">
          <Icon name="link" size={14} />
          Linkul va fi valid {LINK_VALID_ZILE} zile. Clientul poate adauga fisiere pana atunci.
        </div>
      </div>
    </Modal>
  );
}
