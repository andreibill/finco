import { API_ROUTES } from "@constants/api-routes";
import { delay } from "@mocks/delay";
import { store } from "@mocks/fixtures";
import type { ApiResponse, FileItem, FileType } from "@types";
import { ok, fail } from "@services/response";
import { formatBytes } from "@utils/format";

export type FilePreview = { url: string; type: FileType };

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

// Continut "real" simulat pentru previzualizare: un SVG care reda fisierul ca o
// pagina de document. In prod, serviciul intoarce un URL pre-semnat catre fisier.
function mockPreviewDataUrl(file: FileItem): string {
  const name = escapeXml(file.nume_fisier);
  const meta = escapeXml(`tip ${file.type.toUpperCase()} · ${formatBytes(file.bytes)}`);
  const lines = Array.from({ length: 12 }, (_, i) => {
    const w = 620 - (i % 4) * 90;
    return `<rect x='60' y='${320 + i * 46}' width='${w}' height='14' rx='7' fill='#ECECE9'/>`;
  }).join("");
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1035' viewBox='0 0 800 1035'>` +
    `<rect width='800' height='1035' fill='#FFFFFF'/>` +
    `<rect width='800' height='120' fill='#F26B22'/>` +
    `<text x='60' y='74' font-family='sans-serif' font-size='30' font-weight='700' fill='#FFFFFF'>FINCO previzualizare</text>` +
    `<text x='60' y='210' font-family='sans-serif' font-size='30' font-weight='700' fill='#1A1A19'>${name}</text>` +
    `<text x='60' y='254' font-family='monospace' font-size='19' fill='#6B6B68'>${meta}</text>` +
    lines +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function findFile(id: string): FileItem | undefined {
  for (const list of Object.values(store.files)) {
    const f = list.find((x) => x.id === id);
    if (f) return f;
  }
  return undefined;
}

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

  // GET /api/files/{id}/preview — descarca continutul pentru afisare in aplicatie.
  async preview(id: string): Promise<ApiResponse<FilePreview>> {
    void API_ROUTES.FILES.PREVIEW(id);
    await delay(500);
    const file = findFile(id);
    if (!file) return fail("Fisierul nu a fost gasit.");
    if (!file.activ) return fail("Fisierul este dezactivat; nu are continut de previzualizat.");
    return ok({ url: mockPreviewDataUrl(file), type: file.type });
  },

  // DELETE /api/files/{id} — soft delete: marcheaza fisierul inactiv (continutul
  // se sterge, metadatele raman).
  async deactivate(id: string): Promise<ApiResponse<null>> {
    void API_ROUTES.FILES.DEACTIVATE(id);
    await delay(450);
    const file = findFile(id);
    if (!file) return fail("Fisierul nu a fost gasit.");
    file.activ = false;
    return ok(null, "Fisierul a fost dezactivat.");
  },

  // POST /api/files/download — descarca mai multe fisiere (ZIP) dupa lista de id-uri.
  async downloadMany(ids: string[]): Promise<ApiResponse<null>> {
    void API_ROUTES.FILES.DOWNLOAD_MANY;
    void ids;
    await delay(500);
    return ok(null, "Descarcare pregatita.");
  },

  // POST /api/files/deactivate — soft delete in masa dupa lista de id-uri.
  async deactivateMany(ids: string[]): Promise<ApiResponse<null>> {
    void API_ROUTES.FILES.DEACTIVATE_MANY;
    await delay(500);
    ids.forEach((id) => {
      const f = findFile(id);
      if (f) f.activ = false;
    });
    return ok(null, "Fisierele selectate au fost dezactivate.");
  },
};
