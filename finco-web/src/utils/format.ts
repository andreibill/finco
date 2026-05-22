import type { RequestType, DocumentRequest } from "../types";

const MONTHS_SHORT = [
  "ian", "feb", "mar", "apr", "mai", "iun",
  "iul", "aug", "sep", "oct", "nov", "dec",
];

export const MONTHS_RO = [
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
];

// "2026-05" -> "mai 2026"
export function formatPeriodLabel(an_luna: string): string {
  const [year, m] = an_luna.split("-");
  return `${MONTHS_SHORT[parseInt(m, 10) - 1]} ${year}`;
}

// "2026-05" -> "mai" (luna intreaga, pentru hero/titlu public)
export function monthNameFull(an_luna: string): string {
  const m = parseInt(an_luna.split("-")[1], 10);
  return MONTHS_RO[m - 1];
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

// Tipul cererii e derivat din flag-uri (vezi finco-specs.md §8).
export function requestType(r: Pick<DocumentRequest, "automat" | "created_by">): RequestType {
  if (r.automat) return "automat";
  if (r.created_by === "public") return "public";
  return "custom";
}
