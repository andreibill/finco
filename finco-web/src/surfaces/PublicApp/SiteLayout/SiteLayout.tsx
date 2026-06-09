import type { ReactNode } from "react";
import { useHashScroll } from "@hooks/useHashScroll";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import "./SiteLayout.css";

type SiteLayoutProps = {
  children: ReactNode;
  // Clasa optionala pe <main> (ex: gutere pentru paginile de tip formular).
  mainClassName?: string;
};

// Chenarul complet al site-ului public (antet + subsol de prezentare), folosit de
// paginile publice "de site" (Home, Cere link). Fluxul de upload legat prin token
// ramane in PublicShell (chenar minimal, focusat). useHashScroll permite ancorelor
// din meniu sa duca la sectiunile de pe Home din orice pagina.
export function SiteLayout({ children, mainClassName }: SiteLayoutProps) {
  useHashScroll();

  return (
    <div className="site-layout">
      <SiteHeader />
      <main className={`site-layout__main${mainClassName ? ` ${mainClassName}` : ""}`}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
