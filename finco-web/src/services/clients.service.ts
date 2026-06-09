import { API_ROUTES } from "@constants/api-routes";
import { delay } from "@mocks/delay";
import { store, CURRENT_PERIOD } from "@mocks/fixtures";
import type { ApiResponse, Client, Period, ClientFormValues } from "@types";
import { ok, fail } from "@services/response";
import { linkStatusFrom } from "@utils/format";

function initialsFrom(nume: string): string {
  const parts = nume.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0]).join("");
  return (letters || nume.slice(0, 2)).toUpperCase();
}

export const clientsService = {
  // GET /api/clients?period=YYYY-MM
  // Statusul afisat (status / fisiere / ultim upload) e calculat pentru perioada
  // ceruta din istoricul clientului; lipsa unei perioade inseamna "fara upload".
  async list(period: string = CURRENT_PERIOD): Promise<ApiResponse<Client[]>> {
    void API_ROUTES.CLIENTS.LIST;
    await delay(500);
    const clients = store.clients.map((c) => {
      const p = (store.periods[c.id] || []).find((x) => x.an_luna === period);
      // Statusul linkului din cererile (email-urile) pentru client + perioada.
      const reqs = store.requests.filter((r) => r.client_id === c.id && r.period === period);
      const linkStatus = linkStatusFrom(reqs);
      return {
        ...c,
        currentStatus: p ? p.status : "empty",
        currentFiles: p ? p.numar_fisiere : 0,
        lastUpload: p ? p.last_upload : null,
        linkStatus,
      } satisfies Client;
    });
    return ok(clients);
  },

  // GET /api/periods — perioadele disponibile (an_luna), descrescator.
  async availablePeriods(): Promise<ApiResponse<string[]>> {
    void API_ROUTES.PERIODS.LIST;
    await delay(300);
    const set = new Set<string>([CURRENT_PERIOD]);
    Object.values(store.periods).forEach((arr) => arr.forEach((p) => set.add(p.an_luna)));
    const sorted = [...set].sort().reverse();
    return ok(sorted);
  },

  // GET /api/clients/{id}
  async get(id: string): Promise<ApiResponse<Client>> {
    void API_ROUTES.CLIENTS.DETAIL(id);
    await delay(450);
    const client = store.clients.find((c) => c.id === id);
    if (!client) return fail("Clientul nu a fost gasit.");
    return ok({ ...client });
  },

  // GET /api/clients/{id}/periods
  async periods(id: string): Promise<ApiResponse<Period[]>> {
    void API_ROUTES.CLIENTS.PERIODS(id);
    await delay(450);
    const periods = store.periods[id] || [];
    const sorted = [...periods].sort((a, b) => b.an_luna.localeCompare(a.an_luna));
    return ok(sorted.map((p) => ({ ...p })));
  },

  // POST /api/clients
  async create(values: ClientFormValues): Promise<ApiResponse<Client>> {
    void API_ROUTES.CLIENTS.CREATE;
    await delay(600);
    if (store.clients.some((c) => c.email.toLowerCase() === values.email.toLowerCase())) {
      return fail("Email-ul este deja inregistrat.");
    }
    const id = `c-${Date.now()}`;
    const client: Client = {
      id,
      nume: values.nume,
      email: values.email,
      activ: values.activ,
      zi_trimitere: values.zi_trimitere,
      initials: initialsFrom(values.nume),
      currentStatus: "empty",
      currentFiles: 0,
      lastUpload: null,
    };
    store.clients.push(client);
    // Perioada curenta apare goala (in realitate o creeaza jobul lunar / primul upload).
    store.periods[id] = [
      { id: `p-${id}-cur`, client_id: id, an_luna: CURRENT_PERIOD, status: "empty", numar_fisiere: 0, finalizat: false, last_upload: null },
    ];
    return ok({ ...client }, "Contul a fost creat cu succes.");
  },

  // PUT /api/clients/{id}
  async update(id: string, values: ClientFormValues): Promise<ApiResponse<Client>> {
    void API_ROUTES.CLIENTS.UPDATE(id);
    await delay(600);
    const client = store.clients.find((c) => c.id === id);
    if (!client) return fail("Clientul nu a fost gasit.");
    if (store.clients.some((c) => c.id !== id && c.email.toLowerCase() === values.email.toLowerCase())) {
      return fail("Email-ul este deja inregistrat.");
    }
    client.nume = values.nume;
    client.email = values.email;
    client.zi_trimitere = values.zi_trimitere;
    client.activ = values.activ;
    client.initials = initialsFrom(values.nume);
    return ok({ ...client }, "Client salvat.");
  },

  // PUT /api/clients/{id} — activeaza / dezactiveaza un client. Nu stergem
  // niciodata un client (pastram istoricul pentru audit): un client inactiv e
  // tratat ca neinregistrat — nu poate cere sau primi link-uri de upload.
  async setActive(id: string, activ: boolean): Promise<ApiResponse<Client>> {
    void API_ROUTES.CLIENTS.UPDATE(id);
    await delay(450);
    const client = store.clients.find((c) => c.id === id);
    if (!client) return fail("Clientul nu a fost gasit.");
    client.activ = activ;
    return ok(
      { ...client },
      activ ? "Client reactivat." : "Client dezactivat.",
    );
  },
};
