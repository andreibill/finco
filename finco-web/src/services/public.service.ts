import { API_ROUTES } from "@constants/api-routes";
import { delay } from "@mocks/delay";
import { CURRENT_PERIOD, CURRENT_PERIOD_LABEL } from "@mocks/fixtures";
import type { ApiResponse, PublicUploadContext } from "@types";
import { ok } from "@services/response";

// Token-ul prefixat cu "expired" simuleaza un link expirat (pentru click-thru).
function isExpiredToken(token: string): boolean {
  return token.toLowerCase().startsWith("expired");
}

export const publicService = {
  // GET /api/public/upload/{token} — valideaza token + returneaza context.
  async uploadContext(token: string): Promise<ApiResponse<PublicUploadContext>> {
    void API_ROUTES.PUBLIC.UPLOAD_CONTEXT(token);
    await delay(500);
    const expired = isExpiredToken(token);
    return ok({
      companyName: "Florea Construct SRL",
      period: CURRENT_PERIOD,
      periodLabel: CURRENT_PERIOD_LABEL,
      expira_la: "5 iun 2026, 23:59",
      expired,
      expiredAt: "1 mai 2026, 12:00",
    });
  },

  // POST /api/public/upload/{token} — incarca ZIP-ul (mock, fara payload real).
  async upload(token: string): Promise<ApiResponse<null>> {
    void API_ROUTES.PUBLIC.UPLOAD(token);
    await delay(700);
    return ok(null, "Fisierele au fost primite.");
  },

  // POST /api/public/request-link — raspuns generic (anti-enumerare).
  async requestLink(_email: string): Promise<ApiResponse<null>> {
    void API_ROUTES.PUBLIC.REQUEST_LINK;
    await delay(800);
    return ok(null, "Daca adresa este inregistrata, veti primi un link nou.");
  },
};
