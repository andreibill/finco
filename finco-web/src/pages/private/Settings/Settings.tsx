import { Card, Field, Input, Toggle, SkeletonRows, EmptyState, useToast } from "@components";
import { useMe, useSetNotifications } from "@hooks/useMe";
import { useEmailTemplates } from "@hooks/useEmailTemplates";
import { TemplateEditor } from "@features/private/Settings/TemplateEditor";
import { PageShell } from "@surfaces/InternalApp/PageShell";
import { MESSAGES } from "@constants/messages";
import "./Settings.css";

export function Settings() {
  const me = useMe();
  const setNotifications = useSetNotifications();
  const templates = useEmailTemplates(!!me.data?.isAdmin);
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
    <PageShell title="Setari" subtitle="Profilul, notificarile si sabloanele de email.">
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
                <Field label="Nume">{({ inputId }) => <Input id={inputId} value={me.data!.nume} disabled />}</Field>
                <Field label="Email">{({ inputId }) => <Input id={inputId} value={me.data!.email} iconLeft="mail" disabled />}</Field>
              </div>
            </Card>
            <Card padding={22} className="settings__card">
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

        {/* Sabloane email: editabile doar de administrator (text simplu). */}
        {me.data?.isAdmin && (
          <Card padding={22}>
            <h2 className="settings__title">Sabloane email</h2>
            <p className="settings__hint">
              Textul email-urilor trimise clientilor. Linkul de upload se ataseaza automat la final.
            </p>
            {templates.isLoading ? (
              <SkeletonRows rows={3} />
            ) : templates.isError || !templates.data ? (
              <EmptyState
                icon="alert-circle"
                title={MESSAGES.LOAD_ERROR}
                actionLabel={MESSAGES.RELOAD}
                actionIcon="refresh-cw"
                onAction={() => templates.refetch()}
              />
            ) : (
              <div className="settings__templates">
                {templates.data.map((t) => (
                  <TemplateEditor key={t.key} template={t} />
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </PageShell>
  );
}
