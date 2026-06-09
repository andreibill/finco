import { Modal, Button, Skeleton, EmptyState } from "@components";
import { usePreviewFile } from "@hooks/usePeriods";
import { MESSAGES } from "@constants/messages";
import type { FileItem } from "@types";
import "./FilePreviewModal.css";

export type FilePreviewModalProps = {
  file: FileItem;
  open: boolean;
  onClose: () => void;
  onDownload: () => void;
  onDeactivate: () => void;
};

// Previzualizarea unui fisier: descarca continutul (seam de service) si il afiseaza.
// PDF-urile se randeaza intr-un iframe; restul (imagini, mock) intr-un <img>.
// Footer-ul ofera aceleasi actiuni ca randul: descarcare si dezactivare (soft delete).
export function FilePreviewModal({ file, open, onClose, onDownload, onDeactivate }: FilePreviewModalProps) {
  const preview = usePreviewFile(file.id, open);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Previzualizare"
      subtitle={file.nume_fisier}
      width={860}
      footer={
        <>
          <Button variant="secondary" iconLeft="download" onClick={onDownload}>
            Descarca fisier
          </Button>
          <Button variant="danger-soft" iconLeft="trash-2" onClick={onDeactivate}>
            Dezactiveaza fisier
          </Button>
        </>
      }
    >
      <div className="file-preview">
        {preview.isLoading ? (
          <Skeleton height={460} />
        ) : preview.isError || !preview.data ? (
          <EmptyState
            icon="alert-circle"
            title={preview.error instanceof Error ? preview.error.message : MESSAGES.LOAD_ERROR}
            actionLabel={MESSAGES.RELOAD}
            actionIcon="refresh-cw"
            onAction={() => preview.refetch()}
          />
        ) : preview.data.type === "pdf" ? (
          <iframe className="file-preview__frame" src={preview.data.url} title={file.nume_fisier} />
        ) : (
          <img className="file-preview__img" src={preview.data.url} alt={file.nume_fisier} />
        )}
      </div>
    </Modal>
  );
}
