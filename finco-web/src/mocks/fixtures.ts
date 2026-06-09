// Fixtures portate din Finco/app/Data.jsx. Tipate.
// Store-ul in-memory este MUTABIL: mutatiile (adauga client, marcheaza
// finalizat, trimite cerere) modifica aceste structuri, iar React Query
// reflecta starea reala dupa invalidare.
//
// Datele acopera mai multe luni (dec 2025 -> mai 2026) cu cazuri variate
// (clienti constanti, clienti cu luni ratate, perioade partiale, loturi
// multiple, fisiere dezactivate) ca aplicatia sa para una reala.

import type { Client, Period, FileItem, FileType, DocumentRequest, User, EmailTemplate } from "@types";

export const CURRENT_PERIOD = "2026-05";
export const CURRENT_PERIOD_LABEL = "mai 2026";

// Angajatii cabinetului. Maria este administrator; Andrei este angajat obisnuit.
// In mock, login-ul alege utilizatorul dupa email (vezi auth.service).
export const USERS_FIXTURE: User[] = [
  {
    id: "u-1",
    email: "maria@cabinet.ro",
    nume: "Maria Andreescu",
    initials: "MA",
    notificari_active: true,
    isAdmin: true,
  },
  {
    id: "u-2",
    email: "andrei@cabinet.ro",
    nume: "Andrei Popa",
    initials: "AP",
    notificari_active: true,
    isAdmin: false,
  },
];

// Utilizatorul implicit (admin) — folosit cand email-ul de login nu se potriveste
// cu niciun angajat seedat (mock-ul logheaza mereu).
export const CURRENT_USER: User = USERS_FIXTURE[0];

export const CLIENTS_FIXTURE: Client[] = [
  { id: "c-1", nume: "SRL Andrei & Asociatii", email: "contact@andreiasociatii.ro", activ: true, zi_trimitere: 5, initials: "AA", currentStatus: "complete", currentFiles: 14, lastUpload: "21 mai 2026, 14:32" },
  { id: "c-2", nume: "Florea Construct SRL", email: "office@floreaconstruct.ro", activ: true, zi_trimitere: 8, initials: "FC", currentStatus: "partial", currentFiles: 6, lastUpload: "18 mai 2026, 09:11" },
  { id: "c-3", nume: "Popescu Tax SRL", email: "popescu@tax.ro", activ: true, zi_trimitere: 12, initials: "PT", currentStatus: "empty", currentFiles: 0, lastUpload: null },
  { id: "c-4", nume: "Marin Logistics IFN", email: "office@marinlogistics.ro", activ: true, zi_trimitere: 3, initials: "ML", currentStatus: "complete", currentFiles: 22, lastUpload: "5 mai 2026, 17:48" },
  { id: "c-5", nume: "Bucur Trade SRL", email: "contact@bucurtrade.ro", activ: true, zi_trimitere: 10, initials: "BT", currentStatus: "partial", currentFiles: 3, lastUpload: "16 mai 2026, 13:20" },
  { id: "c-6", nume: "Constanta Foods SRL", email: "office@constantafoods.ro", activ: true, zi_trimitere: 15, initials: "CF", currentStatus: "empty", currentFiles: 0, lastUpload: null },
  { id: "c-7", nume: "Iancu Auto SRL", email: "iancu@auto.ro", activ: true, zi_trimitere: 7, initials: "IA", currentStatus: "complete", currentFiles: 9, lastUpload: "9 mai 2026, 11:02" },
  { id: "c-8", nume: "Dobrescu Consulting", email: "raluca@dobrescuconsulting.ro", activ: true, zi_trimitere: 2, initials: "DC", currentStatus: "partial", currentFiles: 4, lastUpload: "4 mai 2026, 15:10" },
  // Client inactiv — pastrat pentru istoric (audit); nu mai primeste link-uri noi.
  { id: "c-9", nume: "Vechi Comert SRL", email: "contact@vechicomert.ro", activ: false, zi_trimitere: 20, initials: "VC", currentStatus: "empty", currentFiles: 0, lastUpload: null },
];

// ---------------------------------------------------------------------------
// Fisiere
// ---------------------------------------------------------------------------
// Helper care construieste FileItem[] dintr-o lista compacta de specificatii.
// Tine numele scurte, marimile in KB si calculeaza id-uri stabile per perioada,
// ca lista FILES_FIXTURE sa ramana lizibila iar numar_fisiere sa fie mereu
// in sincron cu numarul real de fisiere (vezi periodFrom mai jos).
type FileSpec = {
  nume: string;
  type: FileType;
  kb: number;
  lot?: number;
  at?: string; // ISO; gol = ts-ul lotului principal
  activ?: boolean; // false = continut sters (soft delete)
};

function makeFiles(periodId: string, mainAt: string, specs: FileSpec[]): FileItem[] {
  return specs.map((s, i) => ({
    id: `f-${periodId}-${i + 1}`,
    nume_fisier: s.nume,
    bytes: Math.round(s.kb * 1024),
    type: s.type,
    lot: s.lot ?? 1,
    created_at: s.at ?? mainAt,
    activ: s.activ ?? true,
  }));
}

// Fisiere per perioada (keyed by period id). Doar perioadele cu upload apar aici;
// perioadele goale nu au cheie.
export const FILES_FIXTURE: Record<string, FileItem[]> = {
  // --- c-1: SRL Andrei & Asociatii (client constant, istoric complet) ---
  "p-1a": makeFiles("p-1a", "2026-05-21T14:32:00", [
    { nume: "factura-1042-mai.pdf", type: "pdf", kb: 412 },
    { nume: "factura-1043-mai.pdf", type: "pdf", kb: 388 },
    { nume: "extras-banca-comerciala.xlsx", type: "xls", kb: 88 },
    { nume: "extras-banca-transilvania.pdf", type: "pdf", kb: 204 },
    { nume: "bon-fiscal-05-15.jpg", type: "img", kb: 1229 },
    { nume: "contract-furnizor-acme.pdf", type: "pdf", kb: 660 },
    { nume: "stat-de-plata-mai.xlsx", type: "xls", kb: 142, lot: 2, at: "2026-05-22T09:14:00" },
    { nume: "raport-tva-mai.pdf", type: "pdf", kb: 98, lot: 2, at: "2026-05-22T09:14:00" },
  ]),
  "p-1b": makeFiles("p-1b", "2026-04-18T09:10:00", [
    { nume: "factura-1001-apr.pdf", type: "pdf", kb: 320 },
    { nume: "factura-1002-apr.pdf", type: "pdf", kb: 410 },
    { nume: "factura-1003-apr.pdf", type: "pdf", kb: 275 },
    { nume: "extras-bcr-aprilie.pdf", type: "pdf", kb: 188 },
    { nume: "jurnal-vanzari-aprilie.xlsx", type: "xls", kb: 76 },
    { nume: "jurnal-cumparari-aprilie.xlsx", type: "xls", kb: 81 },
    { nume: "stat-de-plata-aprilie.xlsx", type: "xls", kb: 138 },
    { nume: "declaratie-300-aprilie.pdf", type: "pdf", kb: 64 },
    { nume: "bon-fiscal-04-09.jpg", type: "img", kb: 980 },
    { nume: "contract-chirie-sediu.pdf", type: "pdf", kb: 540 },
    { nume: "raport-tva-aprilie.pdf", type: "pdf", kb: 92 },
  ]),
  "p-1c": makeFiles("p-1c", "2026-03-16T11:21:00", [
    { nume: "factura-0912-mar.pdf", type: "pdf", kb: 300 },
    { nume: "factura-0913-mar.pdf", type: "pdf", kb: 256 },
    { nume: "extras-banca-transilvania-martie.pdf", type: "pdf", kb: 176 },
    { nume: "jurnal-vanzari-martie.xlsx", type: "xls", kb: 72 },
    { nume: "stat-de-plata-martie.xlsx", type: "xls", kb: 130 },
    { nume: "bonuri-combustibil-martie.zip", type: "zip", kb: 2300 },
    { nume: "declaratie-394-martie.pdf", type: "pdf", kb: 70 },
    { nume: "raport-tva-martie.pdf", type: "pdf", kb: 88 },
    { nume: "factura-storno-0890.pdf", type: "pdf", kb: 64, activ: false },
  ]),
  "p-1d": makeFiles("p-1d", "2026-02-14T10:05:00", [
    { nume: "factura-0820-feb.pdf", type: "pdf", kb: 290 },
    { nume: "factura-0821-feb.pdf", type: "pdf", kb: 312 },
    { nume: "extras-bcr-februarie.pdf", type: "pdf", kb: 182 },
    { nume: "stat-de-plata-februarie.xlsx", type: "xls", kb: 128 },
    { nume: "jurnal-cumparari-februarie.xlsx", type: "xls", kb: 79 },
    { nume: "bon-fiscal-02-10.jpg", type: "img", kb: 1024 },
    { nume: "raport-tva-februarie.pdf", type: "pdf", kb: 86 },
  ]),
  "p-1e": makeFiles("p-1e", "2026-01-13T16:40:00", [
    { nume: "factura-0701-ian.pdf", type: "pdf", kb: 268 },
    { nume: "extras-banca-comerciala-ianuarie.xlsx", type: "xls", kb: 90 },
    { nume: "stat-de-plata-ianuarie.xlsx", type: "xls", kb: 126 },
    { nume: "declaratie-300-ianuarie.pdf", type: "pdf", kb: 66 },
    { nume: "raport-tva-ianuarie.pdf", type: "pdf", kb: 84 },
  ]),
  "p-1f": makeFiles("p-1f", "2025-12-17T12:18:00", [
    { nume: "factura-0610-dec.pdf", type: "pdf", kb: 256 },
    { nume: "factura-0611-dec.pdf", type: "pdf", kb: 278 },
    { nume: "factura-0612-dec.pdf", type: "pdf", kb: 244 },
    { nume: "extras-bcr-decembrie.pdf", type: "pdf", kb: 170 },
    { nume: "stat-de-plata-decembrie.xlsx", type: "xls", kb: 132 },
    { nume: "bonuri-deplasare-decembrie.zip", type: "zip", kb: 1800 },
    { nume: "declaratie-394-decembrie.pdf", type: "pdf", kb: 72 },
    { nume: "raport-anual-2025.pdf", type: "pdf", kb: 420 },
  ]),

  // --- c-2: Florea Construct SRL ---
  "p-2a": makeFiles("p-2a", "2026-05-18T09:11:00", [
    { nume: "factura-2201-furnizor.pdf", type: "pdf", kb: 320 },
    { nume: "factura-2202-furnizor.pdf", type: "pdf", kb: 298 },
    { nume: "extras-banca-mai.pdf", type: "pdf", kb: 188 },
    { nume: "bonuri-combustibil.zip", type: "zip", kb: 2457 },
    { nume: "stat-de-plata-aprilie.xlsx", type: "xls", kb: 118 },
    { nume: "raport-vanzari-mai.xlsx", type: "xls", kb: 204 },
  ]),
  "p-2b": makeFiles("p-2b", "2026-04-14T16:02:00", [
    { nume: "factura-2101-furnizor.pdf", type: "pdf", kb: 300 },
    { nume: "factura-2102-furnizor.pdf", type: "pdf", kb: 290 },
    { nume: "factura-2103-furnizor.pdf", type: "pdf", kb: 310 },
    { nume: "factura-2104-client.pdf", type: "pdf", kb: 280 },
    { nume: "extras-ing-aprilie.pdf", type: "pdf", kb: 180 },
    { nume: "extras-transilvania-aprilie.pdf", type: "pdf", kb: 175 },
    { nume: "jurnal-vanzari-aprilie.xlsx", type: "xls", kb: 80 },
    { nume: "jurnal-cumparari-aprilie.xlsx", type: "xls", kb: 78 },
    { nume: "stat-de-plata-aprilie.xlsx", type: "xls", kb: 140 },
    { nume: "bonuri-combustibil-aprilie.zip", type: "zip", kb: 2400 },
    { nume: "declaratie-300-aprilie.pdf", type: "pdf", kb: 65 },
    { nume: "raport-tva-aprilie.pdf", type: "pdf", kb: 90 },
  ]),
  "p-2c": makeFiles("p-2c", "2026-03-12T10:45:00", [
    { nume: "factura-2001-furnizor.pdf", type: "pdf", kb: 295 },
    { nume: "factura-2002-furnizor.pdf", type: "pdf", kb: 305 },
    { nume: "extras-ing-martie.pdf", type: "pdf", kb: 178 },
    { nume: "jurnal-vanzari-martie.xlsx", type: "xls", kb: 76 },
    { nume: "stat-de-plata-martie.xlsx", type: "xls", kb: 136 },
    { nume: "bon-fiscal-03-08.jpg", type: "img", kb: 1100 },
    { nume: "declaratie-394-martie.pdf", type: "pdf", kb: 68 },
    { nume: "raport-tva-martie.pdf", type: "pdf", kb: 88 },
  ]),
  "p-2d": makeFiles("p-2d", "2026-02-11T14:50:00", [
    { nume: "factura-1901-furnizor.pdf", type: "pdf", kb: 288 },
    { nume: "factura-1902-furnizor.pdf", type: "pdf", kb: 276 },
    { nume: "extras-transilvania-februarie.pdf", type: "pdf", kb: 172 },
    { nume: "stat-de-plata-februarie.xlsx", type: "xls", kb: 134 },
    { nume: "jurnal-cumparari-februarie.xlsx", type: "xls", kb: 74 },
    { nume: "raport-tva-februarie.pdf", type: "pdf", kb: 84 },
  ]),
  "p-2e": makeFiles("p-2e", "2026-01-13T10:20:00", [
    { nume: "factura-1801-furnizor.pdf", type: "pdf", kb: 282 },
    { nume: "factura-1802-furnizor.pdf", type: "pdf", kb: 268 },
    { nume: "factura-1803-client.pdf", type: "pdf", kb: 256 },
    { nume: "extras-ing-ianuarie.pdf", type: "pdf", kb: 168 },
    { nume: "stat-de-plata-ianuarie.xlsx", type: "xls", kb: 130 },
    { nume: "bonuri-combustibil-ianuarie.zip", type: "zip", kb: 2100 },
    { nume: "declaratie-300-ianuarie.pdf", type: "pdf", kb: 63 },
    { nume: "raport-tva-ianuarie.pdf", type: "pdf", kb: 82 },
  ]),
  "p-2f": makeFiles("p-2f", "2025-12-19T11:00:00", [
    { nume: "factura-1701-furnizor.pdf", type: "pdf", kb: 270 },
    { nume: "extras-transilvania-decembrie.pdf", type: "pdf", kb: 166 },
    { nume: "stat-de-plata-decembrie.xlsx", type: "xls", kb: 132 },
    { nume: "declaratie-394-decembrie.pdf", type: "pdf", kb: 70 },
    { nume: "raport-anual-2025.pdf", type: "pdf", kb: 380 },
  ]),

  // --- c-3: Popescu Tax SRL (client cu luni ratate) ---
  "p-3b": makeFiles("p-3b", "2026-04-13T08:55:00", [
    { nume: "factura-3001-furnizor.pdf", type: "pdf", kb: 240 },
    { nume: "factura-3002-furnizor.pdf", type: "pdf", kb: 252 },
    { nume: "extras-bt-aprilie.pdf", type: "pdf", kb: 160 },
    { nume: "stat-de-plata-aprilie.xlsx", type: "xls", kb: 120 },
    { nume: "bon-fiscal-04-11.jpg", type: "img", kb: 900 },
    { nume: "declaratie-300-aprilie.pdf", type: "pdf", kb: 60 },
    { nume: "raport-tva-aprilie.pdf", type: "pdf", kb: 80 },
  ]),
  "p-3d": makeFiles("p-3d", "2026-02-15T13:12:00", [
    { nume: "factura-2901-furnizor.pdf", type: "pdf", kb: 232 },
    { nume: "extras-bt-februarie.pdf", type: "pdf", kb: 158 },
    { nume: "stat-de-plata-februarie.xlsx", type: "xls", kb: 118 },
    { nume: "declaratie-394-februarie.pdf", type: "pdf", kb: 58 },
    { nume: "raport-tva-februarie.pdf", type: "pdf", kb: 78 },
  ]),

  // --- c-4: Marin Logistics IFN (volum mare, doua loturi) ---
  "p-4a": makeFiles("p-4a", "2026-05-05T17:48:00", [
    { nume: "factura-4001-furnizor.pdf", type: "pdf", kb: 320 },
    { nume: "factura-4002-furnizor.pdf", type: "pdf", kb: 305 },
    { nume: "factura-4003-furnizor.pdf", type: "pdf", kb: 298 },
    { nume: "factura-4004-client.pdf", type: "pdf", kb: 410 },
    { nume: "factura-4005-client.pdf", type: "pdf", kb: 388 },
    { nume: "extras-bt-mai.pdf", type: "pdf", kb: 190 },
    { nume: "extras-bcr-mai.pdf", type: "pdf", kb: 185 },
    { nume: "jurnal-vanzari-mai.xlsx", type: "xls", kb: 86 },
    { nume: "jurnal-cumparari-mai.xlsx", type: "xls", kb: 82 },
    { nume: "stat-de-plata-mai.xlsx", type: "xls", kb: 150, lot: 2, at: "2026-05-06T09:30:00" },
    { nume: "bonuri-transport-mai.zip", type: "zip", kb: 3200, lot: 2, at: "2026-05-06T09:30:00" },
    { nume: "raport-tva-mai.pdf", type: "pdf", kb: 96, lot: 2, at: "2026-05-06T09:30:00" },
  ]),
  "p-4b": makeFiles("p-4b", "2026-04-04T16:20:00", [
    { nume: "factura-3901-furnizor.pdf", type: "pdf", kb: 310 },
    { nume: "factura-3902-furnizor.pdf", type: "pdf", kb: 295 },
    { nume: "factura-3903-client.pdf", type: "pdf", kb: 400 },
    { nume: "extras-bt-aprilie.pdf", type: "pdf", kb: 188 },
    { nume: "extras-bcr-aprilie.pdf", type: "pdf", kb: 182 },
    { nume: "jurnal-vanzari-aprilie.xlsx", type: "xls", kb: 84 },
    { nume: "jurnal-cumparari-aprilie.xlsx", type: "xls", kb: 80 },
    { nume: "stat-de-plata-aprilie.xlsx", type: "xls", kb: 148 },
    { nume: "bonuri-transport-aprilie.zip", type: "zip", kb: 2900 },
    { nume: "raport-tva-aprilie.pdf", type: "pdf", kb: 94 },
  ]),
  "p-4c": makeFiles("p-4c", "2026-03-05T10:11:00", [
    { nume: "factura-3801-furnizor.pdf", type: "pdf", kb: 300 },
    { nume: "factura-3802-furnizor.pdf", type: "pdf", kb: 288 },
    { nume: "extras-bt-martie.pdf", type: "pdf", kb: 180 },
    { nume: "jurnal-vanzari-martie.xlsx", type: "xls", kb: 82 },
    { nume: "stat-de-plata-martie.xlsx", type: "xls", kb: 144 },
    { nume: "bonuri-transport-martie.zip", type: "zip", kb: 2700 },
    { nume: "raport-tva-martie.pdf", type: "pdf", kb: 92 },
    { nume: "aviz-insotire-vechi.pdf", type: "pdf", kb: 70, activ: false },
  ]),
  "p-4d": makeFiles("p-4d", "2026-02-04T15:33:00", [
    { nume: "factura-3701-furnizor.pdf", type: "pdf", kb: 292 },
    { nume: "factura-3702-client.pdf", type: "pdf", kb: 380 },
    { nume: "extras-bcr-februarie.pdf", type: "pdf", kb: 178 },
    { nume: "jurnal-cumparari-februarie.xlsx", type: "xls", kb: 78 },
    { nume: "stat-de-plata-februarie.xlsx", type: "xls", kb: 140 },
    { nume: "bonuri-transport-februarie.zip", type: "zip", kb: 2500 },
    { nume: "raport-tva-februarie.pdf", type: "pdf", kb: 90 },
  ]),
  "p-4e": makeFiles("p-4e", "2026-01-06T09:45:00", [
    { nume: "factura-3601-furnizor.pdf", type: "pdf", kb: 284 },
    { nume: "extras-bt-ianuarie.pdf", type: "pdf", kb: 174 },
    { nume: "jurnal-vanzari-ianuarie.xlsx", type: "xls", kb: 80 },
    { nume: "stat-de-plata-ianuarie.xlsx", type: "xls", kb: 138 },
    { nume: "bonuri-transport-ianuarie.zip", type: "zip", kb: 2300 },
    { nume: "raport-tva-ianuarie.pdf", type: "pdf", kb: 88 },
  ]),
  "p-4f": makeFiles("p-4f", "2025-12-04T17:02:00", [
    { nume: "factura-3501-furnizor.pdf", type: "pdf", kb: 276 },
    { nume: "factura-3502-furnizor.pdf", type: "pdf", kb: 268 },
    { nume: "factura-3503-client.pdf", type: "pdf", kb: 360 },
    { nume: "extras-bcr-decembrie.pdf", type: "pdf", kb: 170 },
    { nume: "jurnal-vanzari-decembrie.xlsx", type: "xls", kb: 78 },
    { nume: "stat-de-plata-decembrie.xlsx", type: "xls", kb: 142 },
    { nume: "bonuri-transport-decembrie.zip", type: "zip", kb: 3100 },
    { nume: "declaratie-394-decembrie.pdf", type: "pdf", kb: 72 },
    { nume: "raport-anual-2025.pdf", type: "pdf", kb: 460 },
  ]),

  // --- c-5: Bucur Trade SRL (perioade partiale frecvente) ---
  "p-5a": makeFiles("p-5a", "2026-05-16T13:20:00", [
    { nume: "factura-5001-furnizor.pdf", type: "pdf", kb: 240 },
    { nume: "extras-bt-mai.pdf", type: "pdf", kb: 160 },
    { nume: "bon-fiscal-05-12.jpg", type: "img", kb: 1024 },
  ]),
  "p-5b": makeFiles("p-5b", "2026-04-13T10:40:00", [
    { nume: "factura-4901-furnizor.pdf", type: "pdf", kb: 248 },
    { nume: "factura-4902-client.pdf", type: "pdf", kb: 320 },
    { nume: "extras-bt-aprilie.pdf", type: "pdf", kb: 162 },
    { nume: "stat-de-plata-aprilie.xlsx", type: "xls", kb: 120 },
    { nume: "declaratie-300-aprilie.pdf", type: "pdf", kb: 60 },
    { nume: "raport-tva-aprilie.pdf", type: "pdf", kb: 80 },
  ]),
  "p-5c": makeFiles("p-5c", "2026-03-22T16:15:00", [
    { nume: "factura-4801-furnizor.pdf", type: "pdf", kb: 236 },
    { nume: "extras-bt-martie.pdf", type: "pdf", kb: 158 },
    { nume: "stat-de-plata-martie.xlsx", type: "xls", kb: 118 },
    { nume: "bon-fiscal-03-20.jpg", type: "img", kb: 980 },
  ]),
  "p-5d": makeFiles("p-5d", "2026-02-12T11:30:00", [
    { nume: "factura-4701-furnizor.pdf", type: "pdf", kb: 230 },
    { nume: "extras-bt-februarie.pdf", type: "pdf", kb: 156 },
    { nume: "stat-de-plata-februarie.xlsx", type: "xls", kb: 116 },
    { nume: "declaratie-394-februarie.pdf", type: "pdf", kb: 58 },
    { nume: "raport-tva-februarie.pdf", type: "pdf", kb: 78 },
  ]),

  // --- c-6: Constanta Foods SRL (un singur upload in istoric) ---
  "p-6c": makeFiles("p-6c", "2026-03-18T14:00:00", [
    { nume: "factura-6001-furnizor.pdf", type: "pdf", kb: 220 },
    { nume: "factura-6002-furnizor.pdf", type: "pdf", kb: 232 },
    { nume: "extras-ing-martie.pdf", type: "pdf", kb: 150 },
    { nume: "stat-de-plata-martie.xlsx", type: "xls", kb: 110 },
    { nume: "declaratie-300-martie.pdf", type: "pdf", kb: 56 },
    { nume: "raport-tva-martie.pdf", type: "pdf", kb: 76 },
  ]),

  // --- c-7: Iancu Auto SRL (mic, constant) ---
  "p-7a": makeFiles("p-7a", "2026-05-09T11:02:00", [
    { nume: "factura-7001-furnizor.pdf", type: "pdf", kb: 260 },
    { nume: "factura-7002-furnizor.pdf", type: "pdf", kb: 248 },
    { nume: "factura-7003-client.pdf", type: "pdf", kb: 300 },
    { nume: "extras-bt-mai.pdf", type: "pdf", kb: 165 },
    { nume: "jurnal-vanzari-mai.xlsx", type: "xls", kb: 74 },
    { nume: "stat-de-plata-mai.xlsx", type: "xls", kb: 128 },
    { nume: "bon-fiscal-05-08.jpg", type: "img", kb: 1100 },
    { nume: "declaratie-300-mai.pdf", type: "pdf", kb: 62 },
    { nume: "raport-tva-mai.pdf", type: "pdf", kb: 84 },
  ]),
  "p-7b": makeFiles("p-7b", "2026-04-08T10:30:00", [
    { nume: "factura-6901-furnizor.pdf", type: "pdf", kb: 252 },
    { nume: "factura-6902-client.pdf", type: "pdf", kb: 290 },
    { nume: "extras-bt-aprilie.pdf", type: "pdf", kb: 162 },
    { nume: "stat-de-plata-aprilie.xlsx", type: "xls", kb: 126 },
    { nume: "declaratie-394-aprilie.pdf", type: "pdf", kb: 60 },
    { nume: "raport-tva-aprilie.pdf", type: "pdf", kb: 82 },
  ]),
  "p-7c": makeFiles("p-7c", "2026-03-09T12:45:00", [
    { nume: "factura-6801-furnizor.pdf", type: "pdf", kb: 244 },
    { nume: "factura-6802-furnizor.pdf", type: "pdf", kb: 256 },
    { nume: "extras-bt-martie.pdf", type: "pdf", kb: 160 },
    { nume: "jurnal-cumparari-martie.xlsx", type: "xls", kb: 72 },
    { nume: "stat-de-plata-martie.xlsx", type: "xls", kb: 124 },
    { nume: "bon-fiscal-03-07.jpg", type: "img", kb: 1000 },
    { nume: "declaratie-300-martie.pdf", type: "pdf", kb: 58 },
    { nume: "raport-tva-martie.pdf", type: "pdf", kb: 80 },
  ]),
  "p-7d": makeFiles("p-7d", "2026-02-08T09:20:00", [
    { nume: "factura-6701-furnizor.pdf", type: "pdf", kb: 238 },
    { nume: "extras-bt-februarie.pdf", type: "pdf", kb: 158 },
    { nume: "stat-de-plata-februarie.xlsx", type: "xls", kb: 122 },
    { nume: "declaratie-394-februarie.pdf", type: "pdf", kb: 56 },
    { nume: "raport-tva-februarie.pdf", type: "pdf", kb: 78 },
  ]),
  "p-7e": makeFiles("p-7e", "2026-01-09T15:00:00", [
    { nume: "factura-6601-furnizor.pdf", type: "pdf", kb: 232 },
    { nume: "factura-6602-client.pdf", type: "pdf", kb: 280 },
    { nume: "extras-bt-ianuarie.pdf", type: "pdf", kb: 156 },
    { nume: "jurnal-vanzari-ianuarie.xlsx", type: "xls", kb: 70 },
    { nume: "stat-de-plata-ianuarie.xlsx", type: "xls", kb: 120 },
    { nume: "declaratie-300-ianuarie.pdf", type: "pdf", kb: 54 },
    { nume: "raport-tva-ianuarie.pdf", type: "pdf", kb: 76 },
  ]),

  // --- c-8: Dobrescu Consulting (partiale recente) ---
  "p-8a": makeFiles("p-8a", "2026-05-04T15:10:00", [
    { nume: "factura-8001-furnizor.pdf", type: "pdf", kb: 226 },
    { nume: "extras-ing-mai.pdf", type: "pdf", kb: 150 },
    { nume: "stat-de-plata-mai.xlsx", type: "xls", kb: 114 },
    { nume: "bon-fiscal-05-03.jpg", type: "img", kb: 920 },
  ]),
  "p-8b": makeFiles("p-8b", "2026-04-03T14:25:00", [
    { nume: "factura-7901-furnizor.pdf", type: "pdf", kb: 234 },
    { nume: "factura-7902-client.pdf", type: "pdf", kb: 300 },
    { nume: "extras-ing-aprilie.pdf", type: "pdf", kb: 152 },
    { nume: "stat-de-plata-aprilie.xlsx", type: "xls", kb: 116 },
    { nume: "declaratie-300-aprilie.pdf", type: "pdf", kb: 56 },
    { nume: "raport-tva-aprilie.pdf", type: "pdf", kb: 78 },
  ]),
  "p-8c": makeFiles("p-8c", "2026-03-04T10:50:00", [
    { nume: "factura-7801-furnizor.pdf", type: "pdf", kb: 228 },
    { nume: "extras-ing-martie.pdf", type: "pdf", kb: 150 },
    { nume: "stat-de-plata-martie.xlsx", type: "xls", kb: 114 },
    { nume: "declaratie-394-martie.pdf", type: "pdf", kb: 54 },
    { nume: "raport-tva-martie.pdf", type: "pdf", kb: 76 },
  ]),
  "p-8d": makeFiles("p-8d", "2026-02-06T16:05:00", [
    { nume: "factura-7701-furnizor.pdf", type: "pdf", kb: 222 },
    { nume: "extras-ing-februarie.pdf", type: "pdf", kb: 148 },
    { nume: "bon-fiscal-02-05.jpg", type: "img", kb: 880 },
  ]),
};

// ---------------------------------------------------------------------------
// Perioade
// ---------------------------------------------------------------------------
// Helper care construieste o perioada deducand numar_fisiere din FILES_FIXTURE,
// ca badge-ul de fisiere sa fie mereu in sincron cu lista reala.
function periodFrom(
  id: string,
  client_id: string,
  an_luna: string,
  status: Period["status"],
  finalizat: boolean,
  last_upload: string | null,
): Period {
  return {
    id,
    client_id,
    an_luna,
    status,
    numar_fisiere: (FILES_FIXTURE[id] ?? []).length,
    finalizat,
    last_upload,
  };
}

// Perioade per client (keyed by client id), descrescator dupa an_luna.
export const PERIODS_FIXTURE: Record<string, Period[]> = {
  "c-1": [
    periodFrom("p-1a", "c-1", "2026-05", "complete", true, "21 mai 2026, 14:32"),
    periodFrom("p-1b", "c-1", "2026-04", "complete", true, "18 apr 2026, 09:10"),
    periodFrom("p-1c", "c-1", "2026-03", "complete", true, "16 mar 2026, 11:21"),
    periodFrom("p-1d", "c-1", "2026-02", "complete", true, "14 feb 2026, 10:05"),
    periodFrom("p-1e", "c-1", "2026-01", "complete", true, "13 ian 2026, 16:40"),
    periodFrom("p-1f", "c-1", "2025-12", "complete", true, "17 dec 2025, 12:18"),
  ],
  "c-2": [
    periodFrom("p-2a", "c-2", "2026-05", "partial", false, "18 mai 2026, 09:11"),
    periodFrom("p-2b", "c-2", "2026-04", "complete", true, "14 apr 2026, 16:02"),
    periodFrom("p-2c", "c-2", "2026-03", "complete", true, "12 mar 2026, 10:45"),
    periodFrom("p-2d", "c-2", "2026-02", "complete", true, "11 feb 2026, 14:50"),
    periodFrom("p-2e", "c-2", "2026-01", "complete", true, "13 ian 2026, 10:20"),
    periodFrom("p-2f", "c-2", "2025-12", "complete", true, "19 dec 2025, 11:00"),
  ],
  "c-3": [
    periodFrom("p-3a", "c-3", "2026-05", "empty", false, null),
    periodFrom("p-3b", "c-3", "2026-04", "complete", true, "13 apr 2026, 08:55"),
    // Luna ratata: link trimis, dar clientul nu a incarcat nimic.
    periodFrom("p-3c", "c-3", "2026-03", "empty", false, null),
    periodFrom("p-3d", "c-3", "2026-02", "complete", true, "15 feb 2026, 13:12"),
  ],
  "c-4": [
    periodFrom("p-4a", "c-4", "2026-05", "complete", true, "6 mai 2026, 09:30"),
    periodFrom("p-4b", "c-4", "2026-04", "complete", true, "4 apr 2026, 16:20"),
    periodFrom("p-4c", "c-4", "2026-03", "complete", true, "5 mar 2026, 10:11"),
    periodFrom("p-4d", "c-4", "2026-02", "complete", true, "4 feb 2026, 15:33"),
    periodFrom("p-4e", "c-4", "2026-01", "complete", true, "6 ian 2026, 09:45"),
    periodFrom("p-4f", "c-4", "2025-12", "complete", true, "4 dec 2025, 17:02"),
  ],
  "c-5": [
    periodFrom("p-5a", "c-5", "2026-05", "partial", false, "16 mai 2026, 13:20"),
    periodFrom("p-5b", "c-5", "2026-04", "complete", true, "13 apr 2026, 10:40"),
    // Luna nefinalizata: upload partial, niciodata inchisa de angajat.
    periodFrom("p-5c", "c-5", "2026-03", "partial", false, "22 mar 2026, 16:15"),
    periodFrom("p-5d", "c-5", "2026-02", "complete", true, "12 feb 2026, 11:30"),
  ],
  "c-6": [
    periodFrom("p-6a", "c-6", "2026-05", "empty", false, null),
    periodFrom("p-6b", "c-6", "2026-04", "empty", false, null),
    periodFrom("p-6c", "c-6", "2026-03", "complete", true, "18 mar 2026, 14:00"),
    periodFrom("p-6d", "c-6", "2026-02", "empty", false, null),
  ],
  "c-7": [
    periodFrom("p-7a", "c-7", "2026-05", "complete", true, "9 mai 2026, 11:02"),
    periodFrom("p-7b", "c-7", "2026-04", "complete", true, "8 apr 2026, 10:30"),
    periodFrom("p-7c", "c-7", "2026-03", "complete", true, "9 mar 2026, 12:45"),
    periodFrom("p-7d", "c-7", "2026-02", "complete", true, "8 feb 2026, 09:20"),
    periodFrom("p-7e", "c-7", "2026-01", "complete", true, "9 ian 2026, 15:00"),
  ],
  "c-8": [
    periodFrom("p-8a", "c-8", "2026-05", "partial", false, "4 mai 2026, 15:10"),
    periodFrom("p-8b", "c-8", "2026-04", "complete", true, "3 apr 2026, 14:25"),
    periodFrom("p-8c", "c-8", "2026-03", "complete", true, "4 mar 2026, 10:50"),
    periodFrom("p-8d", "c-8", "2026-02", "partial", false, "6 feb 2026, 16:05"),
  ],
  // Client inactiv: doar istoric vechi, fara perioada curenta.
  "c-9": [
    periodFrom("p-9a", "c-9", "2025-12", "complete", true, "21 dec 2025, 10:15"),
  ],
};

// ---------------------------------------------------------------------------
// Cereri (document_request) — istoricul email-urilor cu link de upload.
// ---------------------------------------------------------------------------
// Tipul e derivat: automat=true -> lunar; automat=false + created_by angajat ->
// custom; automat=false + created_by "public" -> re-cerere publica.
const MSG_AUTOMAT = (luna: string) =>
  `Buna ziua,\n\nVa rugam sa incarcati prin linkul atasat fisierele contabile pentru luna ${luna}.\n\nMultumim,\nCabinetul.`;
const MSG_CUSTOM = (luna: string) =>
  `Buna ziua,\n\nNe lipsesc cateva documente pentru luna ${luna}. Va rugam sa le incarcati prin linkul atasat.\n\nMultumim,\nCabinetul.`;
const MSG_PUBLIC = (luna: string) =>
  `Buna ziua,\n\nAti solicitat un link nou de upload pentru luna ${luna}. Il gasiti atasat acestui mesaj.\n\nMultumim,\nCabinetul.`;

export const REQUESTS_FIXTURE: DocumentRequest[] = [
  // --- mai 2026 (luna curenta) ---
  { id: "r-1", client: "SRL Andrei & Asociatii", client_id: "c-1", period: "2026-05", automat: true, subiect: "[FINCO] Fisierele lunii mai 2026 — link de upload", mesaj: MSG_AUTOMAT("mai 2026"), created: "5 mai 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-2", client: "Florea Construct SRL", client_id: "c-2", period: "2026-05", automat: true, subiect: "[FINCO] Fisierele lunii mai 2026 — link de upload", mesaj: MSG_AUTOMAT("mai 2026"), created: "8 mai 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-3", client: "Popescu Tax SRL", client_id: "c-3", period: "2026-05", automat: true, subiect: "[FINCO] Fisierele lunii mai 2026 — link de upload", mesaj: MSG_AUTOMAT("mai 2026"), created: "12 mai 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-4", client: "Florea Construct SRL", client_id: "c-2", period: "2026-05", automat: false, subiect: "[FINCO] Fisiere suplimentare — mai 2026", mesaj: MSG_CUSTOM("mai 2026"), created: "19 mai 2026, 11:42", email_trimis: true, created_by: "Maria Andreescu" },
  { id: "r-5", client: "Constanta Foods SRL", client_id: "c-6", period: "2026-05", automat: false, subiect: "[FINCO] Link nou pentru upload", mesaj: MSG_PUBLIC("mai 2026"), created: "20 mai 2026, 15:08", email_trimis: false, created_by: "public", eroare: "Eroare SMTP: timeout" },
  { id: "r-6", client: "Bucur Trade SRL", client_id: "c-5", period: "2026-05", automat: true, subiect: "[FINCO] Fisierele lunii mai 2026 — link de upload", mesaj: MSG_AUTOMAT("mai 2026"), created: "10 mai 2026, 06:00", email_trimis: true, created_by: "sistem" },

  // --- aprilie 2026 ---
  { id: "r-7", client: "SRL Andrei & Asociatii", client_id: "c-1", period: "2026-04", automat: true, subiect: "[FINCO] Fisierele lunii aprilie 2026 — link de upload", mesaj: MSG_AUTOMAT("aprilie 2026"), created: "5 apr 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-8", client: "Florea Construct SRL", client_id: "c-2", period: "2026-04", automat: true, subiect: "[FINCO] Fisierele lunii aprilie 2026 — link de upload", mesaj: MSG_AUTOMAT("aprilie 2026"), created: "8 apr 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-9", client: "Popescu Tax SRL", client_id: "c-3", period: "2026-04", automat: true, subiect: "[FINCO] Fisierele lunii aprilie 2026 — link de upload", mesaj: MSG_AUTOMAT("aprilie 2026"), created: "12 apr 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-10", client: "Marin Logistics IFN", client_id: "c-4", period: "2026-04", automat: true, subiect: "[FINCO] Fisierele lunii aprilie 2026 — link de upload", mesaj: MSG_AUTOMAT("aprilie 2026"), created: "3 apr 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-11", client: "Bucur Trade SRL", client_id: "c-5", period: "2026-04", automat: true, subiect: "[FINCO] Fisierele lunii aprilie 2026 — link de upload", mesaj: MSG_AUTOMAT("aprilie 2026"), created: "10 apr 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-12", client: "Iancu Auto SRL", client_id: "c-7", period: "2026-04", automat: true, subiect: "[FINCO] Fisierele lunii aprilie 2026 — link de upload", mesaj: MSG_AUTOMAT("aprilie 2026"), created: "7 apr 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-13", client: "Dobrescu Consulting", client_id: "c-8", period: "2026-04", automat: true, subiect: "[FINCO] Fisierele lunii aprilie 2026 — link de upload", mesaj: MSG_AUTOMAT("aprilie 2026"), created: "2 apr 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-14", client: "Constanta Foods SRL", client_id: "c-6", period: "2026-04", automat: true, subiect: "[FINCO] Fisierele lunii aprilie 2026 — link de upload", mesaj: MSG_AUTOMAT("aprilie 2026"), created: "15 apr 2026, 06:00", email_trimis: false, created_by: "sistem", eroare: "Eroare SMTP: adresa respinsa" },
  { id: "r-15", client: "Bucur Trade SRL", client_id: "c-5", period: "2026-04", automat: false, subiect: "[FINCO] Fisiere suplimentare — aprilie 2026", mesaj: MSG_CUSTOM("aprilie 2026"), created: "20 apr 2026, 10:15", email_trimis: true, created_by: "Andrei Popa" },

  // --- martie 2026 ---
  { id: "r-16", client: "SRL Andrei & Asociatii", client_id: "c-1", period: "2026-03", automat: true, subiect: "[FINCO] Fisierele lunii martie 2026 — link de upload", mesaj: MSG_AUTOMAT("martie 2026"), created: "5 mar 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-17", client: "Marin Logistics IFN", client_id: "c-4", period: "2026-03", automat: true, subiect: "[FINCO] Fisierele lunii martie 2026 — link de upload", mesaj: MSG_AUTOMAT("martie 2026"), created: "3 mar 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-18", client: "Constanta Foods SRL", client_id: "c-6", period: "2026-03", automat: true, subiect: "[FINCO] Fisierele lunii martie 2026 — link de upload", mesaj: MSG_AUTOMAT("martie 2026"), created: "15 mar 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-19", client: "Iancu Auto SRL", client_id: "c-7", period: "2026-03", automat: true, subiect: "[FINCO] Fisierele lunii martie 2026 — link de upload", mesaj: MSG_AUTOMAT("martie 2026"), created: "7 mar 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-20", client: "Florea Construct SRL", client_id: "c-2", period: "2026-03", automat: false, subiect: "[FINCO] Link nou pentru upload", mesaj: MSG_PUBLIC("martie 2026"), created: "11 mar 2026, 18:42", email_trimis: true, created_by: "public" },

  // --- februarie 2026 ---
  { id: "r-21", client: "SRL Andrei & Asociatii", client_id: "c-1", period: "2026-02", automat: true, subiect: "[FINCO] Fisierele lunii februarie 2026 — link de upload", mesaj: MSG_AUTOMAT("februarie 2026"), created: "5 feb 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-22", client: "Marin Logistics IFN", client_id: "c-4", period: "2026-02", automat: true, subiect: "[FINCO] Fisierele lunii februarie 2026 — link de upload", mesaj: MSG_AUTOMAT("februarie 2026"), created: "3 feb 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-23", client: "Dobrescu Consulting", client_id: "c-8", period: "2026-02", automat: true, subiect: "[FINCO] Fisierele lunii februarie 2026 — link de upload", mesaj: MSG_AUTOMAT("februarie 2026"), created: "2 feb 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-24", client: "Popescu Tax SRL", client_id: "c-3", period: "2026-02", automat: false, subiect: "[FINCO] Link nou pentru upload", mesaj: MSG_PUBLIC("februarie 2026"), created: "16 feb 2026, 09:05", email_trimis: false, created_by: "public", eroare: "Eroare SMTP: timeout" },
];

// Sabloanele de email implicite (text simplu, fara semnatura).
export const EMAIL_TEMPLATES_FIXTURE: EmailTemplate[] = [
  {
    key: "automat",
    nume: "Email lunar automat",
    descriere: "Trimis automat in ziua de trimitere a fiecarui client.",
    subiect: "[FINCO] Fisierele lunii — link de upload",
    mesaj:
      "Buna ziua,\n\nVa rugam sa incarcati prin linkul atasat fisierele contabile pentru luna in curs.\n\nMultumim,\nCabinetul.",
  },
  {
    key: "custom",
    nume: "Cerere custom (Cere fisiere)",
    descriere: "Folosit cand ceri fisiere unui client din aplicatie.",
    subiect: "[FINCO] Fisiere suplimentare — link de upload",
    mesaj:
      "Buna ziua,\n\nVa rugam sa incarcati prin linkul atasat fisierele lipsa pentru luna in curs.\n\nMultumim,\nCabinetul.",
  },
  {
    key: "public",
    nume: "Re-cerere publica",
    descriere: "Trimis cand un client cere singur un link nou de pe site.",
    subiect: "[FINCO] Link nou pentru upload",
    mesaj:
      "Buna ziua,\n\nAti solicitat un link nou de upload. Il gasiti atasat acestui mesaj.\n\nMultumim,\nCabinetul.",
  },
];

// Store-ul mutabil cu care lucreaza serviciile.
export const store = {
  user: { ...CURRENT_USER },
  clients: [...CLIENTS_FIXTURE],
  periods: PERIODS_FIXTURE,
  files: FILES_FIXTURE,
  requests: [...REQUESTS_FIXTURE],
  emailTemplates: EMAIL_TEMPLATES_FIXTURE.map((t) => ({ ...t })),
};
