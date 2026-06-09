import { API_ROUTES } from "@constants/api-routes";
import { delay } from "@mocks/delay";
import { store, CURRENT_PERIOD } from "@mocks/fixtures";
import type { ApiResponse, DocumentRequest } from "@types";
import { ok, fail } from "@services/response";

export type CreateRequestInput = {
  client_id: string;
  subiect: string;
  mesaj: string;
};

export const documentRequestsService = {
  // GET /api/document-requests
  async list(): Promise<ApiResponse<DocumentRequest[]>> {
    void API_ROUTES.DOCUMENT_REQUESTS.LIST;
    await delay(500);
    return ok(store.requests.map((r) => ({ ...r })));
  },

  // POST /api/document-requests — cerere custom (angajat), luna curenta.
  async create(input: CreateRequestInput): Promise<ApiResponse<DocumentRequest>> {
    void API_ROUTES.DOCUMENT_REQUESTS.CREATE;
    await delay(700);
    const client = store.clients.find((c) => c.id === input.client_id);
    if (!client) return fail("Clientul nu a fost gasit.");
    const req: DocumentRequest = {
      id: `r-${Date.now()}`,
      client: client.nume,
      client_id: client.id,
      period: CURRENT_PERIOD,
      automat: false,
      subiect: input.subiect,
      mesaj: input.mesaj,
      created: "acum",
      email_trimis: true,
      created_by: store.user.nume,
    };
    store.requests.unshift(req);
    return ok({ ...req }, "Link trimis catre client.");
  },

  // POST /api/document-requests/{id}/retry — retrimite un email esuat.
  async retry(id: string): Promise<ApiResponse<DocumentRequest>> {
    void API_ROUTES.DOCUMENT_REQUESTS.RETRY(id);
    await delay(700);
    const req = store.requests.find((r) => r.id === id);
    if (!req) return fail("Cererea nu a fost gasita.");
    if (req.email_trimis) return fail("Email-ul a fost deja trimis.");
    req.email_trimis = true;
    req.eroare = undefined;
    req.created = "acum";
    return ok({ ...req }, "Email retrimis catre client.");
  },
};
