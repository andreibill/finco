// Fixtures portate din Finco/app/Data.jsx. Tipate.
// Store-ul in-memory este MUTABIL: mutatiile (adauga client, marcheaza
// finalizat, trimite cerere) modifica aceste structuri, iar React Query
// reflecta starea reala dupa invalidare.

import type { Client, Period, FileItem, DocumentRequest, User } from "@types";

export const CURRENT_PERIOD = "2026-05";
export const CURRENT_PERIOD_LABEL = "mai 2026";

export const CURRENT_USER: User = {
  id: "u-1",
  email: "maria@cabinet.ro",
  nume: "Maria Andreescu",
  initials: "MA",
  notificari_active: true,
};

export const CLIENTS_FIXTURE: Client[] = [
  { id: "c-1", nume: "SRL Andrei & Asociatii", email: "contact@andreiasociatii.ro", activ: true, zi_trimitere: 5, initials: "AA", currentStatus: "complete", currentFiles: 14, lastUpload: "21 mai 2026, 14:32" },
  { id: "c-2", nume: "Florea Construct SRL", email: "office@floreaconstruct.ro", activ: true, zi_trimitere: 8, initials: "FC", currentStatus: "partial", currentFiles: 6, lastUpload: "18 mai 2026, 09:11" },
  { id: "c-3", nume: "Popescu Tax SRL", email: "popescu@tax.ro", activ: true, zi_trimitere: 12, initials: "PT", currentStatus: "empty", currentFiles: 0, lastUpload: null },
  { id: "c-4", nume: "Marin Logistics IFN", email: "office@marinlogistics.ro", activ: true, zi_trimitere: 3, initials: "ML", currentStatus: "complete", currentFiles: 22, lastUpload: "5 mai 2026, 17:48" },
  { id: "c-5", nume: "Bucur Trade SRL", email: "contact@bucurtrade.ro", activ: true, zi_trimitere: 10, initials: "BT", currentStatus: "partial", currentFiles: 3, lastUpload: "16 mai 2026, 13:20" },
  { id: "c-6", nume: "Constanta Foods SRL", email: "office@constantafoods.ro", activ: true, zi_trimitere: 15, initials: "CF", currentStatus: "empty", currentFiles: 0, lastUpload: null },
  { id: "c-7", nume: "Iancu Auto SRL", email: "iancu@auto.ro", activ: true, zi_trimitere: 7, initials: "IA", currentStatus: "complete", currentFiles: 9, lastUpload: "9 mai 2026, 11:02" },
  { id: "c-8", nume: "Dobrescu Consulting", email: "raluca@dobrescuconsulting.ro", activ: true, zi_trimitere: 2, initials: "DC", currentStatus: "partial", currentFiles: 4, lastUpload: "4 mai 2026, 15:10" },
];

// Perioade per client (keyed by client id).
export const PERIODS_FIXTURE: Record<string, Period[]> = {
  "c-1": [
    { id: "p-1a", client_id: "c-1", an_luna: "2026-05", status: "complete", numar_fisiere: 14, finalizat: true, last_upload: "21 mai 2026, 14:32" },
    { id: "p-1b", client_id: "c-1", an_luna: "2026-04", status: "complete", numar_fisiere: 11, finalizat: true, last_upload: "18 apr 2026, 09:10" },
    { id: "p-1c", client_id: "c-1", an_luna: "2026-03", status: "complete", numar_fisiere: 9, finalizat: true, last_upload: "16 mar 2026, 11:21" },
  ],
  "c-2": [
    { id: "p-2a", client_id: "c-2", an_luna: "2026-05", status: "partial", numar_fisiere: 6, finalizat: false, last_upload: "18 mai 2026, 09:11" },
    { id: "p-2b", client_id: "c-2", an_luna: "2026-04", status: "complete", numar_fisiere: 12, finalizat: true, last_upload: "14 apr 2026, 16:02" },
    { id: "p-2c", client_id: "c-2", an_luna: "2026-03", status: "complete", numar_fisiere: 8, finalizat: true, last_upload: "12 mar 2026, 10:45" },
  ],
  "c-3": [
    { id: "p-3a", client_id: "c-3", an_luna: "2026-05", status: "empty", numar_fisiere: 0, finalizat: false, last_upload: null },
    { id: "p-3b", client_id: "c-3", an_luna: "2026-04", status: "complete", numar_fisiere: 7, finalizat: true, last_upload: "13 apr 2026, 08:55" },
  ],
  "c-4": [
    { id: "p-4a", client_id: "c-4", an_luna: "2026-05", status: "complete", numar_fisiere: 22, finalizat: true, last_upload: "5 mai 2026, 17:48" },
  ],
  "c-5": [
    { id: "p-5a", client_id: "c-5", an_luna: "2026-05", status: "partial", numar_fisiere: 3, finalizat: false, last_upload: "16 mai 2026, 13:20" },
  ],
  "c-6": [
    { id: "p-6a", client_id: "c-6", an_luna: "2026-05", status: "empty", numar_fisiere: 0, finalizat: false, last_upload: null },
  ],
  "c-7": [
    { id: "p-7a", client_id: "c-7", an_luna: "2026-05", status: "complete", numar_fisiere: 9, finalizat: true, last_upload: "9 mai 2026, 11:02" },
  ],
  "c-8": [
    { id: "p-8a", client_id: "c-8", an_luna: "2026-05", status: "partial", numar_fisiere: 4, finalizat: false, last_upload: "4 mai 2026, 15:10" },
  ],
};

// Fisiere per perioada (keyed by period id).
export const FILES_FIXTURE: Record<string, FileItem[]> = {
  "p-1a": [
    { id: "f-1", nume_fisier: "factura-1042-april.pdf", dimensiune: "412 KB", type: "pdf", lot: 1, created: "21 mai 2026, 14:32" },
    { id: "f-2", nume_fisier: "factura-1043-april.pdf", dimensiune: "388 KB", type: "pdf", lot: 1, created: "21 mai 2026, 14:32" },
    { id: "f-3", nume_fisier: "extras-banca-comerciala.xlsx", dimensiune: "88 KB", type: "xls", lot: 1, created: "21 mai 2026, 14:32" },
    { id: "f-4", nume_fisier: "extras-banca-transilvania.pdf", dimensiune: "204 KB", type: "pdf", lot: 1, created: "21 mai 2026, 14:32" },
    { id: "f-5", nume_fisier: "bon-fiscal-04-15.jpg", dimensiune: "1.2 MB", type: "img", lot: 1, created: "21 mai 2026, 14:32" },
    { id: "f-6", nume_fisier: "contract-furnizor-acme.pdf", dimensiune: "660 KB", type: "pdf", lot: 1, created: "21 mai 2026, 14:32" },
    { id: "f-7", nume_fisier: "stat-de-plata-mai.xlsx", dimensiune: "142 KB", type: "xls", lot: 2, created: "22 mai 2026, 09:14" },
    { id: "f-8", nume_fisier: "raport-tva.pdf", dimensiune: "98 KB", type: "pdf", lot: 2, created: "22 mai 2026, 09:14" },
  ],
  "p-2a": [
    { id: "f-21", nume_fisier: "factura-2201-furnizor.pdf", dimensiune: "320 KB", type: "pdf", lot: 1, created: "18 mai 2026, 09:11" },
    { id: "f-22", nume_fisier: "factura-2202-furnizor.pdf", dimensiune: "298 KB", type: "pdf", lot: 1, created: "18 mai 2026, 09:11" },
    { id: "f-23", nume_fisier: "extras-banca-mai.pdf", dimensiune: "188 KB", type: "pdf", lot: 1, created: "18 mai 2026, 09:11" },
    { id: "f-24", nume_fisier: "bonuri-combustibil.zip", dimensiune: "2.4 MB", type: "zip", lot: 1, created: "18 mai 2026, 09:11" },
    { id: "f-25", nume_fisier: "stat-de-plata-aprilie.xlsx", dimensiune: "118 KB", type: "xls", lot: 1, created: "18 mai 2026, 09:11" },
    { id: "f-26", nume_fisier: "raport-vanzari-mai.xlsx", dimensiune: "204 KB", type: "xls", lot: 1, created: "18 mai 2026, 09:11" },
  ],
};

export const REQUESTS_FIXTURE: DocumentRequest[] = [
  { id: "r-1", client: "SRL Andrei & Asociatii", client_id: "c-1", period: "2026-05", automat: true, subiect: "[FINCO] Fisierele lunii mai 2026 — link de upload", created: "5 mai 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-2", client: "Florea Construct SRL", client_id: "c-2", period: "2026-05", automat: true, subiect: "[FINCO] Fisierele lunii mai 2026 — link de upload", created: "8 mai 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-3", client: "Popescu Tax SRL", client_id: "c-3", period: "2026-05", automat: true, subiect: "[FINCO] Fisierele lunii mai 2026 — link de upload", created: "12 mai 2026, 06:00", email_trimis: true, created_by: "sistem" },
  { id: "r-4", client: "Florea Construct SRL", client_id: "c-2", period: "2026-05", automat: false, subiect: "[FINCO] Fisiere suplimentare — mai 2026", created: "19 mai 2026, 11:42", email_trimis: true, created_by: "Maria Andreescu" },
  { id: "r-5", client: "Constanta Foods SRL", client_id: "c-6", period: "2026-05", automat: false, subiect: "[FINCO] Link nou pentru upload", created: "20 mai 2026, 15:08", email_trimis: false, created_by: "public", eroare: "Eroare SMTP: timeout" },
  { id: "r-6", client: "Bucur Trade SRL", client_id: "c-5", period: "2026-05", automat: true, subiect: "[FINCO] Fisierele lunii mai 2026 — link de upload", created: "10 mai 2026, 06:00", email_trimis: true, created_by: "sistem" },
];

// Store-ul mutabil cu care lucreaza serviciile.
export const store = {
  user: { ...CURRENT_USER },
  clients: [...CLIENTS_FIXTURE],
  periods: PERIODS_FIXTURE,
  files: FILES_FIXTURE,
  requests: [...REQUESTS_FIXTURE],
};
