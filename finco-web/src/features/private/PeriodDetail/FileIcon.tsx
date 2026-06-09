import { Icon } from "@components";
import type { FileType } from "@types";
import "./FileIcon.css";

// Iconita per tip de fisier (culorile sunt in FileIcon.css, clasa file-icon--{type}).
const TYPE_ICON: Record<FileType, string> = {
  pdf: "file-text",
  xls: "file-text",
  img: "file",
  zip: "file-archive",
};

// Pastila colorata cu iconita tipului de fisier. Folosita de FileRow si FileTable.
export function FileIcon({ type }: { type: FileType }) {
  return (
    <span className={`file-icon file-icon--${type}`}>
      <Icon name={TYPE_ICON[type]} size={16} />
    </span>
  );
}
