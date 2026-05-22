import { createContext, useContext } from "react";

// Permite TopBar-ului (randat de fiecare ecran prin PageShell) sa deschida
// drawer-ul de Sidebar pe mobil.
type LayoutContextValue = { toggleSidebar: () => void };

export const LayoutContext = createContext<LayoutContextValue>({ toggleSidebar: () => {} });

export function useLayout(): LayoutContextValue {
  return useContext(LayoutContext);
}
