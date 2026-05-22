import { Icon } from "../../../components/Icon/Icon";
import { DropZone } from "./DropZone";
import { FileTile } from "./FileTile";
import { monthNameFull } from "../../../utils/format";
import type { PublicUploadContext } from "../../../types";
import "./UploadRightPanel.css";

function FileChip({ icon, label }: { icon?: string; label: string }) {
  return (
    <span className="file-chip">
      {icon && <Icon name={icon} size={12} />}
      {label}
    </span>
  );
}

export type UploadRightPanelProps = {
  context: PublicUploadContext;
  file: File | null;
  progress: number;
  uploading: boolean;
  done: boolean;
  onPick: (file: File | undefined) => void;
  onReset: () => void;
  onUpload: () => void;
};

export function UploadRightPanel({ context, file, progress, uploading, done, onPick, onReset, onUpload }: UploadRightPanelProps) {
  const [year, m] = context.period.split("-");
  const label = `${monthNameFull(context.period)} ${year}`;
  void m;
  const canUpload = !!file && !uploading && !done;

  return (
    <>
      <div className="upload-right__step">Pas 1 din 1</div>
      <h1 className="upload-right__title">
        Incarcati fisierele lunii
        <br />
        <span className="upload-right__title-accent">{label}.</span>
      </h1>

      <div className="upload-right__chips">
        <FileChip icon="file-archive" label=".zip" />
        <FileChip icon="folder" label="Foldere ok" />
        <FileChip label="max 50 MB" />
        <FileChip icon="refresh-cw" label="Re-upload pana la scadenta" />
      </div>

      <div className="upload-right__zone">
        {!file && !done && <DropZone onPick={onPick} />}
        {file && <FileTile file={file} progress={progress} uploading={uploading} done={done} onReset={onReset} />}
      </div>

      <div className="upload-right__cta-wrap">
        <button
          className={`upload-right__cta${done ? " upload-right__cta--done" : ""}`}
          onClick={onUpload}
          disabled={!canUpload}
        >
          <Icon name={done ? "check-circle-2" : "upload"} size={18} />
          {done ? "Incarcat" : uploading ? `Se incarca... ${progress}%` : "Trimite catre cabinet"}
        </button>
      </div>

      <div className="upload-right__note">
        <Icon name="info" size={13} />
        Verificarile finale ale arhivei se fac pe server. Daca aveti probleme, contactati cabinetul.
      </div>
    </>
  );
}
