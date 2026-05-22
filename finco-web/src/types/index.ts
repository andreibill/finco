// Tipuri de domeniu + formatul standard de raspuns API.

export type ApiResponse<T> = {
  status: "success" | "error";
  message: string;
  data: T | null;
};

export type UploadStatus = "empty" | "partial" | "complete";

export type User = {
  id: string;
  email: string;
  nume: string;
  initials: string;
  notificari_active: boolean;
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
  dimensiune: string;
  type: FileType;
  lot: number;
  created: string;
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
