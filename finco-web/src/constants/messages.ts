// Mesaje UI recurente, in romana fara diacritice.

export const MESSAGES = {
  // Auth
  LOGIN_CTA: "Conectare",
  LOGIN_LOADING: "Conectare...",
  // Cereri
  REQUEST_SENT: "Link trimis catre client.",
  REQUEST_SENDING: "Se trimite...",
  // Contact (site public)
  CONTACT_SENT: "Mesajul a fost trimis. Va contactam in cel mai scurt timp.",
  CONTACT_SENDING: "Se trimite...",
  CONTACT_ERROR: "Nu am putut trimite mesajul. Incercati din nou.",
  // Client
  CLIENT_SAVED: "Client salvat.",
  CLIENT_SAVING: "Se salveaza...",
  CLIENT_DEACTIVATED: "Client dezactivat.",
  CLIENT_ACTIVATED: "Client reactivat.",
  CLIENT_STATUS_UPDATING: "Se actualizeaza...",
  // Perioada
  PERIOD_FINALIZED: "Perioada marcata ca finalizata.",
  // Generic
  RELOAD: "Reincarca",
  LOAD_ERROR: "Nu am putut incarca datele.",
  EMPTY_FILTER: "Niciun client nu corespunde filtrelor.",
  EMPTY_CLIENTS: "Niciun client inca.",
} as const;

// Etichete status upload (semafor). StatusPill pastreaza mereu textul.
export const STATUS_LABELS = {
  empty: "niciun upload",
  partial: "partial",
  complete: "incarcat",
  error: "eroare",
} as const;

// Optiuni filtru segmentat din Biblioteca.
export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Toate" },
  { value: "empty", label: "Fara upload" },
  { value: "partial", label: "Partial" },
  { value: "complete", label: "Incarcat" },
] as const;
