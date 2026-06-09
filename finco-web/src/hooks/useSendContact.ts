import { useMutation } from "@tanstack/react-query";
import { contactService, type ContactInput } from "@services/contact.service";
import { unwrap } from "@hooks/unwrap";

// Trimite mesajul din formularul de contact al site-ului public.
export function useSendContact() {
  return useMutation({
    mutationFn: (input: ContactInput) => unwrap(contactService.send(input)),
  });
}
