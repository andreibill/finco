import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { emailTemplatesService, type EmailTemplateInput } from "@services/emailTemplates.service";
import { unwrap } from "@hooks/unwrap";
import { queryKeys } from "@hooks/queryKeys";
import type { EmailTemplateKey } from "@types";

// Sabloanele sunt vizibile doar administratorului; lasam apelantul sa
// dezactiveze query-ul pentru un angajat obisnuit (enabled).
export function useEmailTemplates(enabled = true) {
  return useQuery({
    queryKey: queryKeys.emailTemplates,
    queryFn: () => unwrap(emailTemplatesService.list()),
    enabled,
  });
}

export function useUpdateEmailTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { key: EmailTemplateKey; input: EmailTemplateInput }) =>
      unwrap(emailTemplatesService.update(vars.key, vars.input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.emailTemplates }),
  });
}
