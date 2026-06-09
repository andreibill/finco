import { Modal, Button } from "@components";
import "./ConfirmDialog.css";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  // Stilul butonului de confirmare: "danger" pentru actiuni distructive.
  tone?: "primary" | "danger";
  pending?: boolean;
  pendingLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

// Dialog generic de confirmare, construit peste primitiva Modal. Reutilizabil
// pentru orice actiune care cere o confirmare inainte de executie.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Anuleaza",
  tone = "primary",
  pending = false,
  pendingLabel,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width={440}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button variant={tone} onClick={onConfirm} disabled={pending}>
            {pending ? pendingLabel ?? confirmLabel : confirmLabel}
          </Button>
        </>
      }
    >
      <p className="confirm-dialog__message">{message}</p>
    </Modal>
  );
}
