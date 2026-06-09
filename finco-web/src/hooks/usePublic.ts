import { useMutation, useQuery } from "@tanstack/react-query";
import { publicService } from "@services/public.service";
import { unwrap } from "@hooks/unwrap";
import { queryKeys } from "@hooks/queryKeys";

export function usePublicUploadContext(token: string) {
  return useQuery({
    queryKey: queryKeys.publicUpload(token),
    queryFn: () => unwrap(publicService.uploadContext(token)),
  });
}

export function useUploadFiles(token: string) {
  return useMutation({ mutationFn: () => unwrap(publicService.upload(token)) });
}

export function useRequestLink() {
  return useMutation({ mutationFn: (email: string) => unwrap(publicService.requestLink(email)) });
}
