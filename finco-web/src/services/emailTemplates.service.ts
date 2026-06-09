import { API_ROUTES } from "@constants/api-routes";
import { delay } from "@mocks/delay";
import { store } from "@mocks/fixtures";
import type { ApiResponse, EmailTemplate, EmailTemplateKey } from "@types";
import { ok, fail } from "@services/response";

// Continutul editabil al unui sablon (deocamdata doar text).
export type EmailTemplateInput = {
  subiect: string;
  mesaj: string;
};

export const emailTemplatesService = {
  // GET /api/email-templates
  async list(): Promise<ApiResponse<EmailTemplate[]>> {
    void API_ROUTES.EMAIL_TEMPLATES.LIST;
    await delay(400);
    return ok(store.emailTemplates.map((t) => ({ ...t })));
  },

  // PUT /api/email-templates/{key}
  async update(key: EmailTemplateKey, input: EmailTemplateInput): Promise<ApiResponse<EmailTemplate>> {
    void API_ROUTES.EMAIL_TEMPLATES.UPDATE(key);
    await delay(400);
    const tpl = store.emailTemplates.find((t) => t.key === key);
    if (!tpl) return fail("Sablonul nu a fost gasit");
    tpl.subiect = input.subiect;
    tpl.mesaj = input.mesaj;
    return ok({ ...tpl }, "Sablon salvat");
  },
};
