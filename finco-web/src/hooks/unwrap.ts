import type { ApiResponse } from "@types";

// Despacheteaza ApiResponse<T> pentru React Query: pe eroare arunca cu
// `message` (romana fara diacritice), gata de afisat in Toast / stare de eroare.
export async function unwrap<T>(promise: Promise<ApiResponse<T>>): Promise<T> {
  const res = await promise;
  if (res.status === "error" || res.data === null) {
    throw new Error(res.message);
  }
  return res.data;
}
