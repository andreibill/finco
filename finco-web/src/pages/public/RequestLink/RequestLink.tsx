import { useState } from "react";
import { Field, Input, Icon } from "@components";
import { useRequestLink } from "@hooks/usePublic";
import "./RequestLink.css";

export function RequestLink() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const requestLink = useRequestLink();

  // Validare minima pe client: contine '@'. Raspunsul ramane generic (anti-enumerare).
  const valid = email.includes("@");

  const submit = async () => {
    if (!valid || requestLink.isPending) return;
    await requestLink.mutateAsync(email);
    setSent(true);
  };

  return (
    <div className="request-link">
      <div className="request-link__card">
        {sent ? (
          <div>
            <span className="request-link__icon request-link__icon--ok">
              <Icon name="check-circle-2" size={28} />
            </span>
            <h1 className="request-link__title">Verificati casuta de email.</h1>
            <p className="request-link__text">
              Daca adresa este inregistrata, veti primi imediat un link nou pentru luna in curs.
            </p>
          </div>
        ) : (
          <>
            <span className="request-link__icon request-link__icon--brand">
              <Icon name="link" size={26} />
            </span>
            <h1 className="request-link__title">Cere un link nou</h1>
            <p className="request-link__text">
              Introduceti emailul cu care cabinetul va contacteaza. Va trimitem un link nou pentru luna in curs.
            </p>
            <form
              className="request-link__form"
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
            >
              <Field label="Email">
                {({ inputId }) => (
                  <Input id={inputId} value={email} onChange={setEmail} placeholder="contact@firma.ro" iconLeft="mail" type="email" inputMode="email" autoFocus />
                )}
              </Field>
              <button className="request-link__cta" type="submit" disabled={!valid || requestLink.isPending}>
                {requestLink.isPending ? "Se trimite..." : "Trimite link nou"}
              </button>
            </form>
          </>
        )}
      </div>
      <div className="request-link__note">
        Cererile sunt limitate pentru a preveni abuzul. Daca nu primiti email, contactati cabinetul direct.
      </div>
    </div>
  );
}
