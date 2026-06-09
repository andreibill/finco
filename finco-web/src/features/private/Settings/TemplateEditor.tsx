import { useEffect, useState } from "react";
import { Field, Input, Textarea, Button, useToast } from "@components";
import { useUpdateEmailTemplate } from "@hooks/useEmailTemplates";
import { MESSAGES } from "@constants/messages";
import type { EmailTemplate } from "@types";
import "./TemplateEditor.css";

// Editor pentru un singur sablon de email (text simplu: subiect + mesaj).
export function TemplateEditor({ template }: { template: EmailTemplate }) {
  const update = useUpdateEmailTemplate();
  const { showToast } = useToast();
  const [subiect, setSubiect] = useState(template.subiect);
  const [mesaj, setMesaj] = useState(template.mesaj);

  // Resincronizam campurile cand sablonul se schimba (dupa salvare / refetch).
  useEffect(() => {
    setSubiect(template.subiect);
    setMesaj(template.mesaj);
  }, [template.subiect, template.mesaj]);

  const dirty = subiect !== template.subiect || mesaj !== template.mesaj;
  const canSave = dirty && subiect.trim().length > 0 && !update.isPending;

  const save = async () => {
    try {
      await update.mutateAsync({ key: template.key, input: { subiect, mesaj } });
      showToast({ tone: "ok", title: "Sablon salvat", body: template.nume });
    } catch (e) {
      showToast({ tone: "err", title: e instanceof Error ? e.message : MESSAGES.LOAD_ERROR });
    }
  };

  return (
    <div className="template-editor">
      <div className="template-editor__head">
        <h3 className="template-editor__name">{template.nume}</h3>
        <p className="template-editor__desc">{template.descriere}</p>
      </div>
      <Field label="Subiect">{({ inputId }) => <Input id={inputId} value={subiect} onChange={setSubiect} />}</Field>
      <Field label="Mesaj">
        {({ inputId }) => <Textarea id={inputId} value={mesaj} onChange={setMesaj} rows={6} />}
      </Field>
      <div className="template-editor__actions">
        <Button variant="primary" size="sm" iconLeft="check" onClick={() => void save()} disabled={!canSave}>
          {update.isPending ? "Se salveaza..." : "Salveaza"}
        </Button>
      </div>
    </div>
  );
}
