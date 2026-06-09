// Toate rutele API, centralizate. La trecerea pe backend real, serviciile
// folosesc aceste constante in apelul fetch — nimeni nu hardcodeaza string-uri.

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REFRESH: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",
  },
  ME: {
    GET: "/api/me",
    NOTIFICATIONS: "/api/me/notifications",
  },
  CLIENTS: {
    LIST: "/api/clients",
    CREATE: "/api/clients",
    DETAIL: (id: string) => `/api/clients/${id}`,
    UPDATE: (id: string) => `/api/clients/${id}`,
    PERIODS: (id: string) => `/api/clients/${id}/periods`,
    DOCUMENT_REQUESTS: (id: string) => `/api/clients/${id}/document-requests`,
  },
  PERIODS: {
    FILES: (id: string) => `/api/periods/${id}/files`,
    DOWNLOAD: (id: string) => `/api/periods/${id}/download`,
    DOWNLOAD_LOT: (id: string, lot: number) => `/api/periods/${id}/download?lot=${lot}`,
    FINALIZAT: (id: string) => `/api/periods/${id}/finalizat`,
  },
  FILES: {
    DOWNLOAD: (id: string) => `/api/files/${id}/download`,
  },
  DOCUMENT_REQUESTS: {
    LIST: "/api/document-requests",
    CREATE: "/api/document-requests",
  },
  PUBLIC: {
    UPLOAD_CONTEXT: (token: string) => `/api/public/upload/${token}`,
    UPLOAD: (token: string) => `/api/public/upload/${token}`,
    REQUEST_LINK: "/api/public/request-link",
    CONTACT: "/api/public/contact",
  },
} as const;
