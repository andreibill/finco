// Serviciu auth (mock). La backend real, fiecare metoda devine un fetch catre
// API_ROUTES.AUTH.* — semnatura ramane neschimbata.
import { API_ROUTES } from "@constants/api-routes";
import { delay } from "@mocks/delay";
import { store, USERS_FIXTURE } from "@mocks/fixtures";
import type { ApiResponse, User } from "@types";
import { ok } from "@services/response";

export type LoginCredentials = { email: string; parola: string };

export const authService = {
  // POST /api/auth/login — in mock reuseste mereu dupa ~600ms. Alege angajatul
  // seedat dupa email (ca sa poti testa si rolul admin, si cel obisnuit); daca
  // email-ul nu se potriveste, cade pe utilizatorul implicit.
  async login(creds: LoginCredentials): Promise<ApiResponse<User>> {
    void API_ROUTES.AUTH.LOGIN;
    await delay(600);
    const email = creds.email.trim().toLowerCase();
    const matched = USERS_FIXTURE.find((u) => u.email.toLowerCase() === email);
    store.user = { ...(matched ?? store.user) };
    return ok({ ...store.user }, "Autentificare reusita");
  },

  // POST /api/auth/logout
  async logout(): Promise<ApiResponse<null>> {
    void API_ROUTES.AUTH.LOGOUT;
    await delay(200);
    return ok(null, "Deconectare reusita");
  },
};
