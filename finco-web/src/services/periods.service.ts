import { API_ROUTES } from "../constants/api-routes";
import { delay } from "../mocks/delay";
import { store } from "../mocks/fixtures";
import type { ApiResponse, FileItem, Period } from "../types";
import { ok, fail } from "./response";

function findPeriod(id: string): Period | undefined {
  for (const list of Object.values(store.periods)) {
    const p = list.find((x) => x.id === id);
    if (p) return p;
  }
  return undefined;
}

export const periodsService = {
  // GET /api/periods/{id}/files
  async files(id: string): Promise<ApiResponse<FileItem[]>> {
    void API_ROUTES.PERIODS.FILES(id);
    await delay(500);
    const files = store.files[id] || [];
    return ok(files.map((f) => ({ ...f })));
  },

  // PUT /api/periods/{id}/finalizat  (endpoint de adaugat — mock)
  async markFinalizat(id: string): Promise<ApiResponse<Period>> {
    void API_ROUTES.PERIODS.FINALIZAT(id);
    await delay(500);
    const period = findPeriod(id);
    if (!period) return fail("Perioada nu a fost gasita.");
    period.finalizat = true;
    period.status = "complete";
    // Sincronizeaza statusul clientului pentru perioada curenta.
    const client = store.clients.find((c) => c.id === period.client_id);
    if (client && store.periods[client.id]?.[0]?.id === period.id) {
      client.currentStatus = "complete";
    }
    return ok({ ...period }, "Perioada marcata ca finalizata.");
  },
};
