import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentRequestsService, type CreateRequestInput } from "../services/documentRequests.service";
import { unwrap } from "./unwrap";
import { queryKeys } from "./queryKeys";

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
