// Tipuri de domeniu + formatul standard de raspuns API.

export type ApiResponse<T> = {
  status: "success" | "error";
  message: string;
  data: T | null;
};

export type UploadStatus = "empty" | "partial" | "complete";

// Statusul linkului de upload pentru o perioada: trimis (link generat si email
// trimis), esuat (generat, dar email-ul a esuat) sau negenerat (niciun link inca).
export type LinkStatus = "trimis" | "esuat" | "negenerat";

export type User = {
  id: string;
  email: string;
  nume: string;
  initials: string;
  notificari_active: boolean;
  // Rolul de administrator: un angajat cu isAdmin poate face actiuni extra
  // fata de un angajat obisnuit (deocamdata doar expus in UI, fara ecrane proprii).
  isAdmin: boolean;
};

// Sabloanele de email editabile de cabinet. Cele trei tipuri de email catre
// client (vezi tipul cererii din domain.md): lunar automat, cerere custom,
// re-cerere publica. Deocamdata doar text simplu (subiect + mesaj).
export type EmailTemplateKey = "automat" | "custom" | "public";

export type EmailTemplate = {
  key: EmailTemplateKey;
  nume: string; // eticheta afisata in Setari
  descriere: string; // cand se foloseste sablonul
  subiect: string;
  mesaj: string;
};

export type Client = {
  id: string;
  nume: string;
  email: string;
  activ: boolean;
  zi_trimitere: number; // 1-28
  initials: string;
  currentStatus: UploadStatus;
  currentFiles: number;
  lastUpload: string | null;
  // Snapshot pe perioada afisata (setat de clientsService.list); statusul
  // linkului de upload pentru acea perioada.
  linkStatus?: LinkStatus;
};

export type Period = {
  id: string;
  client_id: string;
  an_luna: string; // ex. "2026-05"
  status: UploadStatus;
  numar_fisiere: number;
  finalizat: boolean;
  last_upload: string | null;
};

export type FileType = "pdf" | "xls" | "img" | "zip";

export type FileItem = {
  id: string;
  nume_fisier: string;
  bytes: number; // marime in bytes (sursa pentru sortare; afisare prin formatBytes)
  type: FileType;
  lot: number;
  created_at: string; // ISO (sursa pentru sortare; afisare prin formatDateTime)
  // Soft delete: false = continutul a fost sters, raman doar metadatele (fisier
  // dezactivat). Nu mai poate fi descarcat.
  activ: boolean;
};

// Tipul cererii e derivat, nu stocat (vezi utils/requestType).
export type RequestType = "automat" | "custom" | "public";

export type DocumentRequest = {
  id: string;
  client: string;
  client_id: string;
  period: string;
  automat: boolean;
  subiect: string;
  mesaj?: string;
  created: string;
  email_trimis: boolean;
  created_by: string; // "sistem" | "public" | numele angajatului
  eroare?: string;
};

// Datele necesare formularului de adaugare/editare client.
export type ClientFormValues = {
  nume: string;
  email: string;
  zi_trimitere: number;
  activ: boolean;
};

// Context pentru pagina publica de upload (din token).
export type PublicUploadContext = {
  companyName: string;
  period: string;
  periodLabel: string;
  expira_la: string;
  expired: boolean;
  expiredAt: string;
};
