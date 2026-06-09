import { FileSelectToggle } from "@features/private/PeriodDetail/FileSelectToggle";
import { FileActions } from "@features/private/PeriodDetail/FileActions";
import { useFileSelection } from "@features/private/PeriodDetail/FileSelectionContext";
import { formatBytes } from "@utils/format";
import type { FileItem } from "@types";
import "./FileRow.css";

export function FileRow({ file, periodId }: { file: FileItem; periodId: string }) {
  const sel = useFileSelection();
  const selected = sel.isSelected(file.id);
  return (
    <div className={`file-row${file.activ ? "" : " file-row--inactive"}${selected ? " file-row--selected" : ""}`}>
      <FileSelectToggle file={file} />
      <div className="file-row__main">
        <div className="file-row__name">{file.nume_fisier}</div>
        <div className="file-row__meta">
          {formatBytes(file.bytes)} · {file.type.toUpperCase()}
        </div>
      </div>
      <FileActions file={file} periodId={periodId} />
    </div>
  );
}
