import type { FileItem } from "@types";

// Moduri de afisare pentru fisierele unei perioade.
export const FILE_VIEWS = {
  LOT: "lot", // grupate pe lot (arhiva incarcata) - implicit
  ALL: "toate", // lista plata, sortabila (explorer)
} as const;
export type FileView = (typeof FILE_VIEWS)[keyof typeof FILE_VIEWS];

// Cheile de sortare pentru vederea "toate fisierele".
export type FileSortKey = "nume" | "tip" | "marime" | "data" | "lot";
export type SortDir = "asc" | "desc";

// Coloanele tabelului sortabil. `numeric` cere aliniere/sortare numerica.
export const FILE_SORT_COLUMNS: {
  key: FileSortKey;
  label: string;
  numeric?: boolean;
}[] = [
  { key: "nume", label: "Nume" },
  { key: "tip", label: "Tip" },
  { key: "marime", label: "Marime", numeric: true },
  { key: "data", label: "Data" },
  { key: "lot", label: "Lot", numeric: true },
];

export const DEFAULT_FILE_SORT: FileSortKey = "nume";
export const DEFAULT_SORT_DIR: SortDir = "asc";

// Comparatori per cheie (mereu crescator; directia se aplica deasupra).
const COMPARATORS: Record<FileSortKey, (a: FileItem, b: FileItem) => number> = {
  nume: (a, b) => a.nume_fisier.localeCompare(b.nume_fisier, "ro"),
  tip: (a, b) => a.type.localeCompare(b.type),
  marime: (a, b) => a.bytes - b.bytes,
  data: (a, b) => a.created_at.localeCompare(b.created_at),
  lot: (a, b) => a.lot - b.lot,
};

// Sorteaza o copie a listei dupa cheie + directie.
export function sortFiles(files: FileItem[], key: FileSortKey, dir: SortDir): FileItem[] {
  const cmp = COMPARATORS[key] ?? COMPARATORS[DEFAULT_FILE_SORT];
  const sorted = [...files].sort(cmp);
  return dir === "desc" ? sorted.reverse() : sorted;
}
