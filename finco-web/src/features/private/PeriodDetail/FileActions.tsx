import { useState } from "react";
import { IconButton, Menu, Badge, Tooltip, useToast } from "@components";
import { ConfirmDialog } from "@components/modals/ConfirmDialog/ConfirmDialog";
import { FilePreviewModal } from "@features/private/PeriodDetail/FilePreviewModal";
import { useDownloadFile, useDeactivateFile } from "@hooks/usePeriods";
import type { FileItem } from "@types";
import "./FileActions.css";

// Actiunile unui fisier: previzualizare + meniu (descarcare, dezactivare soft).
// Dezactivarea cere confirmare (sterge continutul, pastreaza metadatele).
export function FileActions({ file, periodId }: { file: FileItem; periodId: string }) {
  const download = useDownloadFile();
  const deactivate = useDeactivateFile(periodId);
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Fisier dezactivat: nu mai exista continut de previzualizat/descarcat.
  if (!file.activ) {
    return <Badge variant="neutral">Dezactivat</Badge>;
  }

  const onDownload = async () => {
    await download.mutateAsync(file.id);
    showToast({ tone: "info", title: "Descarcare pregatita.", body: file.nume_fisier });
  };

  const onDeactivate = async () => {
    // Inchidem dialogul imediat (confirmarea a fost data); raportam rezultatul prin toast.
    setConfirmOpen(false);
    try {
      await deactivate.mutateAsync(file.id);
      showToast({ tone: "ok", title: "Fisier dezactivat.", body: file.nume_fisier });
    } catch (e) {
      showToast({ tone: "err", title: e instanceof Error ? e.message : "Eroare." });
    }
  };

  return (
    <div className="file-actions">
      <Tooltip text="Previzualizare">
        <IconButton name="eye" label="Previzualizare" onClick={() => setPreviewOpen(true)} />
      </Tooltip>
      <Menu
        label="Actiuni fisier"
        items={[
          { icon: "download", label: "Descarca fisier", onClick: () => void onDownload() },
          { icon: "trash-2", label: "Dezactiveaza fisier", tone: "danger", onClick: () => setConfirmOpen(true) },
        ]}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Dezactiveaza fisierul"
        message={`Continutul fisierului "${file.nume_fisier}" va fi sters definitiv; raman doar metadatele. Actiunea nu poate fi anulata.`}
        confirmLabel="Dezactiveaza"
        tone="danger"
        onConfirm={() => void onDeactivate()}
        onClose={() => setConfirmOpen(false)}
      />
      <FilePreviewModal
        file={file}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onDownload={() => void onDownload()}
        // Inchidem previzualizarea inainte de a deschide confirmarea (fara modale suprapuse).
        onDeactivate={() => {
          setPreviewOpen(false);
          setConfirmOpen(true);
        }}
      />
    </div>
  );
}
