import type { ApiResponse } from "@types";

// Helper-e pentru a construi raspunsuri in formatul standard ApiResponse<T>.
export function ok<T>(data: T, message = "OK"): ApiResponse<T> {
  return { status: "success", message, data };
}

export function fail<T = null>(message: string): ApiResponse<T> {
  return { status: "error", message, data: null };
}
