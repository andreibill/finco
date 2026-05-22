import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/Card/Card";
import { Field } from "../../components/Field/Field";
import { Input } from "../../components/Input/Input";
import { PasswordInput } from "../../components/PasswordInput/PasswordInput";
import { Button } from "../../components/Button/Button";
import { Logo } from "../../components/Logo/Logo";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";
import { MESSAGES } from "../../constants/messages";
import "./LoginScreen.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("maria@cabinet.ro");
  const [parola, setParola] = useState("parola123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailInvalid = email.length > 0 && !EMAIL_RE.test(email);

  const submit = async () => {
    if (!EMAIL_RE.test(email)) {
      setError("Introduceti o adresa de email valida.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login({ email, parola });
      navigate(ROUTES.APP.BIBLIOTECA, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Autentificare esuata.");
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__inner">
        <div className="login__logo">
          <Logo size={36} />
        </div>
        <Card padding={28}>
          <div className="login__head">
            <h1 className="login__title">Conectare cabinet</h1>
            <p className="login__subtitle">Intrati cu emailul si parola de angajat.</p>
          </div>
          <form
            className="login__form"
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <Field label="Email" error={emailInvalid ? "Adresa de email nu este valida." : undefined}>
              {({ inputId, describedBy }) => (
                <Input
                  id={inputId}
                  ariaDescribedBy={describedBy}
                  value={email}
                  onChange={setEmail}
                  placeholder="nume@cabinet.ro"
                  iconLeft="mail"
                  type="email"
                  inputMode="email"
                  error={emailInvalid}
                  autoFocus
                />
              )}
            </Field>
            <Field label="Parola">
              {({ inputId, describedBy }) => (
                <PasswordInput id={inputId} ariaDescribedBy={describedBy} value={parola} onChange={setParola} />
              )}
            </Field>
            {error && <p className="login__error">{error}</p>}
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
              {loading ? MESSAGES.LOGIN_LOADING : MESSAGES.LOGIN_CTA}
            </Button>
          </form>
          <div className="login__note">Clientii nu au cont. Folosesc doar linkul primit pe email.</div>
        </Card>
        <div className="login__footer">FINCO Expert · biblioteca de fisiere lunare</div>
      </div>
    </div>
  );
}
