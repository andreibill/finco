// Cheile React Query, centralizate. Filtrele din URL devin parte din cheie,
// deci refetch-ul se face automat la schimbarea filtrului.

export const queryKeys = {
  me: ["me"] as const,
  clients: (filters?: { cauta?: string; status?: string }) =>
    ["clients", filters ?? {}] as const,
  client: (id: string) => ["client", id] as const,
  clientPeriods: (id: string) => ["client", id, "periods"] as const,
  periodFiles: (id: string) => ["period", id, "files"] as const,
  documentRequests: ["document-requests"] as const,
  publicUpload: (token: string) => ["public-upload", token] as const,
};
