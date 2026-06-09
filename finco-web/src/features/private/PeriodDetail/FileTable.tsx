import { Card, Icon } from "@components";
import { FileSelectToggle } from "@features/private/PeriodDetail/FileSelectToggle";
import { FileActions } from "@features/private/PeriodDetail/FileActions";
import { useFileSelection } from "@features/private/PeriodDetail/FileSelectionContext";
import { formatBytes, formatDateTime } from "@utils/format";
import { FILE_SORT_COLUMNS } from "@constants/files";
import type { FileSortKey, SortDir } from "@constants/files";
import type { FileItem } from "@types";
import "./FileTable.css";

export type FileTableProps = {
  files: FileItem[];
  periodId: string;
  sortKey: FileSortKey;
  dir: SortDir;
  onSort: (key: FileSortKey) => void;
};

export function FileTable({ files, periodId, sortKey, dir, onSort }: FileTableProps) {
  const sel = useFileSelection();
  return (
    <Card padding={0} className="file-table__card">
      <div className="file-table__scroll">
        <table className="file-table">
          <thead>
            <tr>
              {FILE_SORT_COLUMNS.map((col) => {
                const active = col.key === sortKey;
                return (
                  <th
                    key={col.key}
                    className={`file-table__th${col.numeric ? " file-table__th--num" : ""}${active ? " file-table__th--active" : ""}`}
                    aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
                  >
                    <button type="button" className="file-table__sort" onClick={() => onSort(col.key)}>
                      <span>{col.label}</span>
                      <Icon
                        name={active ? (dir === "asc" ? "chevron-up" : "chevron-down") : "chevrons-up-down"}
                        size={14}
                        className="file-table__sort-icon"
                      />
                    </button>
                  </th>
                );
              })}
              <th className="file-table__th file-table__th--actions" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr
                key={f.id}
                className={`file-table__row${f.activ ? "" : " file-table__row--inactive"}${sel.isSelected(f.id) ? " file-table__row--selected" : ""}`}
              >
                <td className="file-table__name-cell">
                  <FileSelectToggle file={f} />
                  <span className="file-table__name" title={f.nume_fisier}>
                    {f.nume_fisier}
                  </span>
                </td>
                <td className="file-table__type">{f.type.toUpperCase()}</td>
                <td className="file-table__num">{formatBytes(f.bytes)}</td>
                <td className="file-table__date">{formatDateTime(f.created_at)}</td>
                <td className="file-table__num">{f.lot}</td>
                <td className="file-table__actions-cell">
                  <div className="file-table__actions">
                    <FileActions file={f} periodId={periodId} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
