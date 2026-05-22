import { useEffect, useState } from "react";
import { Modal } from "../../components/Modal/Modal";
import { Field } from "../../components/Field/Field";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { Toggle } from "../../components/Toggle/Toggle";
import { useToast } from "../../components/ToastProvider/ToastProvider";
import { useCreateClient, useUpdateClient } from "../../hooks/useClients";
import type { Client, ClientFormValues } from "../../types";
import { MESSAGES } from "../../constants/messages";
import "./ClientFormModal.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CommonProps = { open: boolean; onClose: () => void };
export type ClientFormModalProps =
  | ({ mode: "add"; client?: undefined } & CommonProps)
  | ({ mode: "edit"; client: Client } & CommonProps);

export function ClientFormModal(props: ClientFormModalProps) {
  const { open, onClose, mode } = props;
  const { showToast } = useToast();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient(mode === "edit" ? props.client.id : "");

  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [zi, setZi] = useState("1");
  const [activ, setActiv] = useState(true);
  // Eroare de server pe email (ex. duplicat) — separata de validarea de format.
  const [emailServerError, setEmailServerError] = useState<string | null>(null);
  // Campurile "atinse": eroarea apare doar dupa ce utilizatorul a interactionat.
  const [touched, setTouched] = useState({ nume: false, email: false, zi: false });

  const touch = (field: keyof typeof touched) => setTouched((t) => ({ ...t, [field]: true }));

  // Reumple campurile la deschidere (preumplut in editare).
  useEffect(() => {
    if (!open) return;
    setEmailServerError(null);
    setTouched({ nume: false, email: false, zi: false });
    if (mode === "edit") {
      setNume(props.client.nume);
      setEmail(props.client.email);
      setZi(String(props.client.zi_trimitere));
      setActiv(props.client.activ);
    } else {
      setNume("");
      setEmail("");
      setZi("1");
      setActiv(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const ziNum = parseInt(zi, 10);
  const numeValid = nume.trim().length > 0;
  const emailValid = EMAIL_RE.test(email);
  const ziValid = Number.isInteger(ziNum) && ziNum >= 1 && ziNum <= 28;
  const formValid = numeValid && emailValid && ziValid;

  const pending = createMutation.isPending || updateMutation.isPending;

  // Mesaj de eroare per camp, afisat doar dupa "touch" (sau dupa o incercare de salvare).
  const numeError = touched.nume && !numeValid ? "Numele este obligatoriu." : undefined;
  const emailError = emailServerError
    ? emailServerError
    : touched.email && email.trim().length === 0
      ? "Email-ul este obligatoriu."
      : touched.email && !emailValid
        ? "Adresa de email nu este valida."
        : undefined;
  const ziError = touched.zi && !ziValid ? "Ziua trebuie sa fie intre 1 si 28." : undefined;

  const onEmailChange = (v: string) => {
    setEmail(v);
    if (emailServerError) setEmailServerError(null);
  };

  const submit = async () => {
    if (!formValid) {
      // Marcheaza toate campurile ca atinse ca sa apara erorile la incercarea de salvare.
      setTouched({ nume: true, email: true, zi: true });
      return;
    }
    setEmailServerError(null);
    const values: ClientFormValues = { nume: nume.trim(), email: email.trim(), zi_trimitere: ziNum, activ };
    try {
      if (mode === "edit") {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
      showToast({ tone: "ok", title: MESSAGES.CLIENT_SAVED, body: values.nume });
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Salvare esuata.";
      // Eroarea de email duplicat se leaga de campul email.
      if (msg.toLowerCase().includes("email")) {
        setEmailServerError(msg);
        touch("email");
      } else {
        showToast({ tone: "err", title: msg });
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Editeaza client" : "Adauga client"}
      subtitle={mode === "edit" ? "Actualizeaza datele clientului." : "Inroleaza un client nou in cabinet."}
      width={520}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Anuleaza
          </Button>
          <Button variant="primary" iconLeft="check" onClick={() => void submit()} disabled={pending}>
            {pending ? MESSAGES.CLIENT_SAVING : "Salveaza"}
          </Button>
        </>
      }
    >
      <div className="client-form">
        <Field label="Nume" error={numeError}>
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              ariaDescribedBy={describedBy}
              value={nume}
              onChange={setNume}
              onBlur={() => touch("nume")}
              placeholder="Denumirea firmei"
              error={!!numeError}
              autoFocus
            />
          )}
        </Field>
        <Field
          label="Email"
          error={emailError}
          hint="Adresa cu care clientul cere link din formularul public."
        >
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              ariaDescribedBy={describedBy}
              value={email}
              onChange={onEmailChange}
              onBlur={() => touch("email")}
              placeholder="contact@firma.ro"
              iconLeft="mail"
              type="email"
              inputMode="email"
              error={!!emailError}
            />
          )}
        </Field>
        <Field
          label="Zi trimitere"
          error={ziError}
          hint="Ziua din luna (1-28) in care primeste automat email-ul lunar."
        >
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              ariaDescribedBy={describedBy}
              value={zi}
              onChange={(v) => setZi(v.replace(/[^0-9]/g, ""))}
              onBlur={() => touch("zi")}
              inputMode="numeric"
              error={!!ziError}
            />
          )}
        </Field>
        <div className="client-form__toggle">
          <div>
            <div className="client-form__toggle-label">Activ</div>
            <div className="client-form__toggle-hint">Clientii inactivi nu primesc email-uri lunare.</div>
          </div>
          <Toggle value={activ} onChange={setActiv} label="Activ" />
        </div>
      </div>
    </Modal>
  );
}
