import type { RequestType, DocumentRequest, LinkStatus } from "@types";

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

// ISO -> "21 mai 2026, 14:32" (romana fara diacritice, ora 24h)
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getDate()} ${MONTHS_RO[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Statusul linkului de upload pentru un client+perioada, derivat din cererile
// (email-urile) lor: macar un email trimis -> "trimis"; doar esuate -> "esuat";
// niciuna -> "negenerat".
export function linkStatusFrom(reqs: Pick<DocumentRequest, "email_trimis">[]): LinkStatus {
  if (!reqs.length) return "negenerat";
  return reqs.some((r) => r.email_trimis) ? "trimis" : "esuat";
}

// Tipul cererii e derivat din flag-uri (vezi finco-specs.md §8).
export function requestType(r: Pick<DocumentRequest, "automat" | "created_by">): RequestType {
  if (r.automat) return "automat";
  if (r.created_by === "public") return "public";
  return "custom";
}
