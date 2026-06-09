import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { periodsService } from "@services/periods.service";
import { filesService } from "@services/files.service";
import { unwrap } from "@hooks/unwrap";
import { queryKeys } from "@hooks/queryKeys";

export function usePeriodFiles(periodId: string) {
  return useQuery({
    queryKey: queryKeys.periodFiles(periodId),
    queryFn: () => unwrap(periodsService.files(periodId)),
    // Fara perioada (client fara upload in luna selectata) nu interogam.
    enabled: !!periodId,
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

// Previzualizare fisier: descarca continutul (URL) doar cand modalul e deschis.
export function usePreviewFile(id: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.filePreview(id),
    queryFn: () => unwrap(filesService.preview(id)),
    enabled,
  });
}

export function useDownloadPeriod() {
  return useMutation({
    mutationFn: (args: { id: string; lot?: number }) =>
      unwrap(filesService.downloadPeriod(args.id, args.lot)),
  });
}

// Soft delete fisier: dezactiveaza (sterge continutul, pastreaza metadatele).
export function useDeactivateFile(periodId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unwrap(filesService.deactivate(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.periodFiles(periodId) }),
  });
}

// Actiuni in masa pe fisiere selectate.
export function useDownloadFiles() {
  return useMutation({ mutationFn: (ids: string[]) => unwrap(filesService.downloadMany(ids)) });
}

export function useDeactivateFiles(periodId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => unwrap(filesService.deactivateMany(ids)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.periodFiles(periodId) }),
  });
}
