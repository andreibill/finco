import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentRequestsService, type CreateRequestInput } from "@services/documentRequests.service";
import { unwrap } from "@hooks/unwrap";
import { queryKeys } from "@hooks/queryKeys";

export function useDocumentRequests() {
  return useQuery({
    queryKey: queryKeys.documentRequests,
    queryFn: () => unwrap(documentRequestsService.list()),
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRequestInput) => unwrap(documentRequestsService.create(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.documentRequests }),
  });
}
