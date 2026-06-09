import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// La schimbarea hash-ului (ex: /#servicii), deruleaza lin la sectiunea tinta.
// Astfel ancorele din meniu (Servicii/Despre/Contact) functioneaza si cand vii
// de pe alta pagina publica, nu doar de pe Home.
export function useHashScroll() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);
}
