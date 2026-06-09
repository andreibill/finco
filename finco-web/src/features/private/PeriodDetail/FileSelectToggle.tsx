import { Icon } from "@components";
import { FileIcon } from "@features/private/PeriodDetail/FileIcon";
import { useFileSelection } from "@features/private/PeriodDetail/FileSelectionContext";
import type { FileItem } from "@types";
import "./FileSelectToggle.css";

// Iconita fisierului devine si comutatorul de selectie (cand selectia e activa).
// Click pe iconita selecteaza/deselecteaza fisierul. Fisierele dezactivate sau
// contextul fara selectie afiseaza doar iconita normala (FileIcon).
export function FileSelectToggle({ file }: { file: FileItem }) {
  const sel = useFileSelection();

  if (!sel.selectable || !file.activ) {
    return <FileIcon type={file.type} />;
  }

  const checked = sel.isSelected(file.id);

  return (
    <button
      type="button"
      className={`file-select${checked ? " file-select--on" : ""}`}
      onClick={() => sel.toggle(file.id)}
      aria-pressed={checked}
      aria-label={checked ? "Deselecteaza fisierul" : "Selecteaza fisierul"}
    >
      {checked ? (
        <span className="file-select__chip">
          <Icon name="check" size={16} />
        </span>
      ) : (
        <FileIcon type={file.type} />
      )}
      {/* Indiciu la hover: arata ca iconita e si buton de selectie. */}
      <span className="file-select__hint">
        <Icon name="check" size={16} />
      </span>
    </button>
  );
}
