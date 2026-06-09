import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@services/clients.service";
import { unwrap } from "@hooks/unwrap";
import { queryKeys } from "@hooks/queryKeys";
import type { ClientFormValues } from "@types";

// Filtrele (cautare + status + perioada) vin din URL si fac parte din cheia de
// query. Cautarea/statusul raman client-side in mock; perioada decide ce status
// afiseaza serviciul. In prod aceiasi parametri merg server-side.
export function useClients(filters: { cauta: string; status: string; period?: string }) {
  return useQuery({
    queryKey: queryKeys.clients(filters),
    queryFn: () => unwrap(clientsService.list(filters.period)),
    select: (clients) => {
      const cauta = filters.cauta.trim().toLowerCase();
      return clients.filter((c) => {
        const matchesSearch =
          !cauta ||
          c.nume.toLowerCase().includes(cauta) ||
          c.email.toLowerCase().includes(cauta);
        const matchesStatus = filters.status === "all" || c.currentStatus === filters.status;
        return matchesSearch && matchesStatus;
      });
    },
  });
}

// Toti clientii (fara filtre de cautare) — pentru KPI-uri si ClientPicker.
// Optional pe o perioada; implicit perioada curenta.
export function useAllClients(period?: string) {
  return useQuery({
    queryKey: queryKeys.clients(period ? { period } : undefined),
    queryFn: () => unwrap(clientsService.list(period)),
  });
}

// Perioadele disponibile (an_luna), pentru selectorul de perioada din Biblioteca.
export function useAvailablePeriods() {
  return useQuery({
    queryKey: queryKeys.periodsList,
    queryFn: () => unwrap(clientsService.availablePeriods()),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: queryKeys.client(id),
    queryFn: () => unwrap(clientsService.get(id)),
  });
}

export function useClientPeriods(id: string) {
  return useQuery({
    queryKey: queryKeys.clientPeriods(id),
    queryFn: () => unwrap(clientsService.periods(id)),
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: ClientFormValues) => unwrap(clientsService.create(values)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useUpdateClient(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: ClientFormValues) => unwrap(clientsService.update(id, values)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: queryKeys.client(id) });
    },
  });
}

// Activeaza / dezactiveaza un client (soft, fara stergere — vezi serviciu).
export function useSetClientActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, activ }: { id: string; activ: boolean }) =>
      unwrap(clientsService.setActive(id, activ)),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: queryKeys.client(id) });
    },
  });
}
