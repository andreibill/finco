import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@services/clients.service";
import { unwrap } from "@hooks/unwrap";
import { queryKeys } from "@hooks/queryKeys";
import type { ClientFormValues } from "@types";

// Filtrele (cautare + status) vin din URL si fac parte din cheia de query.
// Filtrarea ramane client-side in mock; in prod aceiasi parametri merg server-side.
export function useClients(filters: { cauta: string; status: string }) {
  return useQuery({
    queryKey: queryKeys.clients(filters),
    queryFn: () => unwrap(clientsService.list()),
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

// Toti clientii (fara filtre) — pentru KPI-uri si ClientPicker.
export function useAllClients() {
  return useQuery({
    queryKey: queryKeys.clients(),
    queryFn: () => unwrap(clientsService.list()),
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
