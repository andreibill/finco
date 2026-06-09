import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { CURRENT_PERIOD } from "@mocks/fixtures";

// Perioada (an_luna) selectata pentru intreaga suprafata Biblioteca: o schimbi
// intr-un loc (lista sau detaliul clientului) si se reflecta peste tot.
//
// Sursa de adevar e starea din context; o oglindim in URL (?period) cu `replace`
// — la fel ca celelalte filtre (vezi rules/frontend.md §5) — ca sa ramana
// partajabila si sa reziste la refresh / deep-link.
type BibliotecaPeriodContextValue = {
  period: string;
  setPeriod: (value: string) => void;
};

const BibliotecaPeriodContext = createContext<BibliotecaPeriodContextValue | null>(null);

export function BibliotecaPeriodProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams();
  // Initializare din URL pentru deep-link; apoi starea e sursa de adevar.
  const [period, setPeriod] = useState(() => params.get("period") ?? CURRENT_PERIOD);

  // Oglindeste perioada in URL-ul paginii curente (perioada curenta = URL curat).
  useEffect(() => {
    const inUrl = params.get("period") ?? CURRENT_PERIOD;
    if (inUrl === period) return;
    const next = new URLSearchParams(params);
    if (period === CURRENT_PERIOD) next.delete("period");
    else next.set("period", period);
    setParams(next, { replace: true });
  }, [period, params, setParams]);

  return (
    <BibliotecaPeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </BibliotecaPeriodContext.Provider>
  );
}

export function useBibliotecaPeriod(): BibliotecaPeriodContextValue {
  const ctx = useContext(BibliotecaPeriodContext);
  if (!ctx) throw new Error("useBibliotecaPeriod trebuie folosit in suprafata Biblioteca");
  return ctx;
}
