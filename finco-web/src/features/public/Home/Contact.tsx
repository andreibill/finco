import { useState } from "react";
import { Field, Input, Textarea, Button, Icon, useToast } from "@components";
import { COMPANY, SECTIONS } from "@constants/company";
import { MESSAGES } from "@constants/messages";
import { useSendContact } from "@hooks/useSendContact";
import "./Contact.css";

// Sectiunea Contact: date de contact + formular (mutatie React Query, mock).
export function Contact() {
  const { showToast } = useToast();
  const sendContact = useSendContact();

  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [mesaj, setMesaj] = useState("");

  const valid = nume.trim().length > 1 && email.includes("@") && mesaj.trim().length > 4;

  const submit = () => {
    if (!valid || sendContact.isPending) return;
    sendContact.mutate(
      { nume: nume.trim(), email: email.trim(), mesaj: mesaj.trim() },
      {
        onSuccess: () => {
          showToast({ tone: "ok", title: "Trimis", body: MESSAGES.CONTACT_SENT });
          setNume("");
          setEmail("");
          setMesaj("");
        },
        onError: () => {
          showToast({ tone: "err", title: "Eroare", body: MESSAGES.CONTACT_ERROR });
        },
      },
    );
  };

  return (
    <section id={SECTIONS.CONTACT} className="home-section contact">
      <div className="home-section__head">
        <span className="home-section__eyebrow t-overline">Contact</span>
        <h2 className="home-section__title t-h1">Hai sa discutam despre firma ta</h2>
        <p className="home-section__subtitle t-body">
          Scrie-ne un mesaj sau suna-ne — raspundem in cel mai scurt timp.
        </p>
      </div>

      <div className="contact__grid">
        <ul className="contact__details">
          <li className="contact__detail">
            <span className="contact__detail-icon">
              <Icon name="map-pin" size={18} />
            </span>
            <span>
              <span className="contact__detail-label t-label">Adresa</span>
              <span className="contact__detail-value t-body">
                {COMPANY.contact.adresa}, {COMPANY.contact.oras}
              </span>
            </span>
          </li>
          <li className="contact__detail">
            <span className="contact__detail-icon">
              <Icon name="phone" size={18} />
            </span>
            <span>
              <span className="contact__detail-label t-label">Telefon</span>
              <a className="contact__detail-value contact__detail-link t-body" href={COMPANY.contact.telefonHref}>
                {COMPANY.contact.telefon}
              </a>
            </span>
          </li>
          <li className="contact__detail">
            <span className="contact__detail-icon">
              <Icon name="mail" size={18} />
            </span>
            <span>
              <span className="contact__detail-label t-label">Email</span>
              <a className="contact__detail-value contact__detail-link t-body" href={`mailto:${COMPANY.contact.email}`}>
                {COMPANY.contact.email}
              </a>
            </span>
          </li>
          <li className="contact__detail">
            <span className="contact__detail-icon">
              <Icon name="clock" size={18} />
            </span>
            <span>
              <span className="contact__detail-label t-label">Program</span>
              {COMPANY.contact.program.map((p) => (
                <span key={p.zile} className="contact__detail-value t-body">
                  {p.zile}: {p.ore}
                </span>
              ))}
            </span>
          </li>
        </ul>

        <form
          className="contact__form"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Field label="Nume">
            {({ inputId }) => (
              <Input id={inputId} value={nume} onChange={setNume} placeholder="Numele tau" />
            )}
          </Field>
          <Field label="Email">
            {({ inputId }) => (
              <Input
                id={inputId}
                value={email}
                onChange={setEmail}
                placeholder="email@firma.ro"
                type="email"
                inputMode="email"
                iconLeft="mail"
              />
            )}
          </Field>
          <Field label="Mesaj">
            {({ inputId }) => (
              <Textarea id={inputId} value={mesaj} onChange={setMesaj} rows={5} placeholder="Cum te putem ajuta?" />
            )}
          </Field>
          <Button type="submit" size="lg" fullWidth iconLeft="mail-plus" disabled={!valid || sendContact.isPending}>
            {sendContact.isPending ? MESSAGES.CONTACT_SENDING : "Trimite mesajul"}
          </Button>
        </form>
      </div>
    </section>
  );
}
