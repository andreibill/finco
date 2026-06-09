import { useState } from "react";
import { Button, useToast } from "@components";
import { ConfirmDialog } from "@components/modals/ConfirmDialog/ConfirmDialog";
import { useFileSelection } from "@features/private/PeriodDetail/FileSelectionContext";
import { useDownloadFiles, useDeactivateFiles } from "@hooks/usePeriods";
import type { FileItem } from "@types";
import "./FileBulkBar.css";

// Bara de selectie pentru actiuni in masa: selecteaza tot (fisierele active ale
// perioadei) + descarca / dezactiveaza fisierele selectate.
export function FileBulkBar({ files, periodId }: { files: FileItem[]; periodId: string }) {
  const sel = useFileSelection();
  const download = useDownloadFiles();
  const deactivate = useDeactivateFiles(periodId);
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Doar fisierele active pot fi selectate (cele dezactivate nu mai au continut).
  const activeIds = files.filter((f) => f.activ).map((f) => f.id);
  const selectedIds = activeIds.filter((id) => sel.isSelected(id));
  const count = selectedIds.length;
  const allSelected = activeIds.length > 0 && count === activeIds.length;

  // Bara (cu "Selecteaza tot" si actiunile in masa) apare doar dupa prima selectie;
  // selectia se porneste dand click pe iconita unui fisier.
  if (count === 0) return null;

  const onDownload = async () => {
    await download.mutateAsync(selectedIds);
    showToast({ tone: "info", title: "Descarcare pregatita.", body: `${count} fisiere selectate` });
  };

  const onDeactivate = async () => {
    setConfirmOpen(false);
    try {
      await deactivate.mutateAsync(selectedIds);
      sel.clear();
      showToast({ tone: "ok", title: "Fisiere dezactivate.", body: `${count} fisiere` });
    } catch (e) {
      showToast({ tone: "err", title: e instanceof Error ? e.message : "Eroare." });
    }
  };

  return (
    <div className="file-bulk">
      <label className="file-bulk__all">
        <input
          type="checkbox"
          className="file-bulk__check"
          checked={allSelected}
          onChange={() => sel.setMany(activeIds, !allSelected)}
          aria-label="Selecteaza toate fisierele"
        />
        <span>{count > 0 ? `${count} selectate` : "Selecteaza tot"}</span>
      </label>

      {count > 0 && (
        <div className="file-bulk__actions">
          <Button variant="secondary" size="sm" iconLeft="download" onClick={() => void onDownload()}>
            Descarca selectate
          </Button>
          <Button variant="danger-soft" size="sm" iconLeft="trash-2" onClick={() => setConfirmOpen(true)}>
            Dezactiveaza selectate
          </Button>
          <Button variant="ghost" size="sm" onClick={() => sel.clear()}>
            Anuleaza
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Dezactiveaza fisierele selectate"
        message={`Continutul celor ${count} fisiere selectate va fi sters definitiv; raman doar metadatele. Actiunea nu poate fi anulata.`}
        confirmLabel="Dezactiveaza"
        tone="danger"
        onConfirm={() => void onDeactivate()}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
