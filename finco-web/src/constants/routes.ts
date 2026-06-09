// Rutele frontend. Prefixul /app exista doar in prototip (in prod cabinetul e
// pe subdomeniul app.finco.ro, fara prefix). Schimband APP_PREFIX intr-un
// singur loc se trece la forma de productie.

export const APP_PREFIX = "/app";

export const ROUTES = {
  // Suprafata cabinet (intern)
  APP: {
    ROOT: APP_PREFIX,
    LOGIN: `${APP_PREFIX}/login`,
    BIBLIOTECA: `${APP_PREFIX}/biblioteca`,
    CLIENT: (id: string) => `${APP_PREFIX}/clienti/${id}`,
    PERIOD: (clientId: string, periodId: string) =>
      `${APP_PREFIX}/clienti/${clientId}/perioade/${periodId}`,
    CERERI: `${APP_PREFIX}/cereri`,
    SETARI: `${APP_PREFIX}/setari`,
  },
  // Suprafata publica
  PUBLIC: {
    HOME: "/",
    UPLOAD: (token: string) => `/upload/${token}`,
    CERE_LINK: "/cere-link",
  },
} as const;
