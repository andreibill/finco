import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meService } from "@services/me.service";
import { unwrap } from "@hooks/unwrap";
import { queryKeys } from "@hooks/queryKeys";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => unwrap(meService.get()),
  });
}

export function useSetNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (active: boolean) => unwrap(meService.setNotifications(active)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.me }),
  });
}
