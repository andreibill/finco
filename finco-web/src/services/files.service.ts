import { API_ROUTES } from "@constants/api-routes";
import { delay } from "@mocks/delay";
import type { ApiResponse } from "@types";
import { ok } from "@services/response";

// Descarcarile sunt no-op in mock (in prod returneaza un URL pre-semnat /
// streameaza continutul). Pastram seam-ul curat pentru backend real.
export const filesService = {
  // GET /api/files/{id}/download
  async download(id: string): Promise<ApiResponse<null>> {
    void API_ROUTES.FILES.DOWNLOAD(id);
    await delay(400);
    return ok(null, "Descarcare pregatita.");
  },

  // GET /api/periods/{id}/download (ZIP perioada) — optional pe lot.
  async downloadPeriod(id: string, lot?: number): Promise<ApiResponse<null>> {
    void (lot != null ? API_ROUTES.PERIODS.DOWNLOAD_LOT(id, lot) : API_ROUTES.PERIODS.DOWNLOAD(id));
    await delay(400);
    return ok(null, "Descarcare pregatita.");
  },
};
