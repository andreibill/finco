import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { periodsService } from "@services/periods.service";
import { filesService } from "@services/files.service";
import { unwrap } from "@hooks/unwrap";
import { queryKeys } from "@hooks/queryKeys";

export function usePeriodFiles(periodId: string) {
  return useQuery({
    queryKey: queryKeys.periodFiles(periodId),
    queryFn: () => unwrap(periodsService.files(periodId)),
  });
}

export function useMarkFinalizat(clientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (periodId: string) => unwrap(periodsService.markFinalizat(periodId)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.clientPeriods(clientId) });
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

// Descarcarile sunt no-op in mock; expuse ca mutatii pentru seam-ul curat.
export function useDownloadFile() {
  return useMutation({ mutationFn: (id: string) => unwrap(filesService.download(id)) });
}

export function useDownloadPeriod() {
  return useMutation({
    mutationFn: (args: { id: string; lot?: number }) =>
      unwrap(filesService.downloadPeriod(args.id, args.lot)),
  });
}
