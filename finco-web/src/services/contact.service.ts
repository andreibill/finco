import { API_ROUTES } from "@constants/api-routes";
import { delay } from "@mocks/delay";
import type { ApiResponse } from "@types";
import { ok } from "@services/response";

export type ContactInput = {
  nume: string;
  email: string;
  mesaj: string;
};

export const contactService = {
  // POST /api/public/contact — mesaj de pe pagina de prezentare.
  // Intoarce un payload ne-null (unwrap arunca pe data === null).
  async send(input: ContactInput): Promise<ApiResponse<{ trimis: true }>> {
    void API_ROUTES.PUBLIC.CONTACT;
    void input;
    await delay(700);
    return ok({ trimis: true }, "Mesaj trimis.");
  },
};
