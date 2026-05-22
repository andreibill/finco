import { Card } from "../../components/Card/Card";
import { Field } from "../../components/Field/Field";
import { Input } from "../../components/Input/Input";
import { Toggle } from "../../components/Toggle/Toggle";
import { SkeletonRows } from "../../components/Skeleton/Skeleton";
import { useMe, useSetNotifications } from "../../hooks/useMe";
import { useToast } from "../../components/ToastProvider/ToastProvider";
import { PageShell } from "../../surfaces/InternalApp/PageShell";
import "./SettingsScreen.css";

export function SettingsScreen() {
  const me = useMe();
  const setNotifications = useSetNotifications();
  const { showToast } = useToast();

  const onToggle = async (active: boolean) => {
    try {
      await setNotifications.mutateAsync(active);
      showToast({ tone: "ok", title: active ? "Notificari activate." : "Notificari dezactivate." });
    } catch (e) {
      showToast({ tone: "err", title: e instanceof Error ? e.message : "Eroare." });
    }
  };

  return (
    <PageShell title="Setari" subtitle="Profilul si notificarile angajatului.">
      <div className="settings">
      {me.isLoading || !me.data ? (
        <Card>
          <SkeletonRows rows={2} />
        </Card>
      ) : (
        <>
          <Card padding={22} className="settings__card">
            <h2 className="settings__title">Profil</h2>
            <div className="settings__fields">
              <Field label="Nume">{({ inputId }) => <Input id={inputId} value={me.data!.nume} />}</Field>
              <Field label="Email">{({ inputId }) => <Input id={inputId} value={me.data!.email} iconLeft="mail" />}</Field>
            </div>
          </Card>
          <Card padding={22}>
            <h2 className="settings__title">Notificari</h2>
            <div className="settings__row">
              <div>
                <div className="settings__row-label">Email la upload nou</div>
                <div className="settings__row-hint">Primesti un email cand un client incarca fisiere.</div>
              </div>
              <Toggle
                value={me.data.notificari_active}
                onChange={(v) => void onToggle(v)}
                label="Email la upload nou"
              />
            </div>
          </Card>
        </>
      )}
      </div>
    </PageShell>
  );
}
