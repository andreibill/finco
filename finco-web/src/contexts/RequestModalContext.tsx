import { createContext, useContext } from "react";
import type { Client } from "@types";

// Permite oricarui ecran cabinet sa deschida RequestDocumentsModal-ul global.
// `null` = deschide fara client preselectat (se alege din lista).
type RequestModalContextValue = {
  openRequestModal: (client: Client | null) => void;
};

export const RequestModalContext = createContext<RequestModalContextValue | null>(null);

export function useRequestModal(): RequestModalContextValue {
  const ctx = useContext(RequestModalContext);
  if (!ctx) throw new Error("useRequestModal trebuie folosit in suprafata cabinet");
  return ctx;
}
