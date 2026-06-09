// Serviciu auth (mock). La backend real, fiecare metoda devine un fetch catre
// API_ROUTES.AUTH.* — semnatura ramane neschimbata.
import { API_ROUTES } from "@constants/api-routes";
import { delay } from "@mocks/delay";
import { store } from "@mocks/fixtures";
import type { ApiResponse, User } from "@types";
import { ok } from "@services/response";

export type LoginCredentials = { email: string; parola: string };

export const authService = {
  // POST /api/auth/login — in mock reuseste mereu dupa ~600ms.
  async login(_creds: LoginCredentials): Promise<ApiResponse<User>> {
    void API_ROUTES.AUTH.LOGIN;
    await delay(600);
    return ok({ ...store.user }, "Autentificare reusita");
  },

  // POST /api/auth/logout
  async logout(): Promise<ApiResponse<null>> {
    void API_ROUTES.AUTH.LOGOUT;
    await delay(200);
    return ok(null, "Deconectare reusita");
  },
};
