import { Icon } from "../../components/Icon/Icon";
import { IconButton } from "../../components/IconButton/IconButton";
import { useDownloadFile } from "../../hooks/usePeriods";
import { useToast } from "../../components/ToastProvider/ToastProvider";
import type { FileItem, FileType } from "../../types";
import "./FileRow.css";

// Iconita per tip de fisier (culorile sunt in FileRow.css, clasa file-icon--{type}).
const TYPE_ICON: Record<FileType, string> = {
  pdf: "file-text",
  xls: "file-text",
  img: "file",
  zip: "file-archive",
};

export function FileRow({ file }: { file: FileItem }) {
  const download = useDownloadFile();
  const { showToast } = useToast();

  const onDownload = async () => {
    await download.mutateAsync(file.id);
    showToast({ tone: "info", title: "Descarcare pregatita.", body: file.nume_fisier });
  };

  return (
    <div className="file-row">
      <span className={`file-row__icon file-icon--${file.type}`}>
        <Icon name={TYPE_ICON[file.type]} size={16} />
      </span>
      <div className="file-row__main">
        <div className="file-row__name">{file.nume_fisier}</div>
        <div className="file-row__meta">
          {file.dimensiune} · {file.type.toUpperCase()}
        </div>
      </div>
      <div className="file-row__actions">
        <IconButton name="eye" label="Vezi fisier" />
        <IconButton name="download" label="Descarca fisier" onClick={() => void onDownload()} />
        <IconButton name="more-horizontal" label="Actiuni fisier" />
      </div>
    </div>
  );
}
