import { Link } from "react-router-dom";
import { Logo, Icon, Seo } from "@components";
import { ROUTES } from "@constants/routes";
import "./PublicShell.css";

export type PublicShellProps = {
  children: React.ReactNode;
  // Titlu pentru tab/SEO. Paginile din shell (upload, cere-link) sunt noindex:
  // sunt fluxuri private legate prin token, nu trebuie indexate.
  seoTitle?: string;
};

export function PublicShell({ children, seoTitle = "FINCO Expert" }: PublicShellProps) {
  return (
    <div className="public-shell">
      <Seo title={seoTitle} path={ROUTES.PUBLIC.HOME} noindex />
      <header className="public-shell__header">
        <Logo size={26} />
        <Link className="public-shell__link" to={ROUTES.PUBLIC.CERE_LINK}>
          <Icon name="link" size={14} />
          Cere un link nou
        </Link>
      </header>
      <main className="public-shell__main">
        <div className="public-shell__container">{children}</div>
      </main>
      <footer className="public-shell__footer">
        FINCO Expert · pagina publica de upload · linkul este criptat si valabil pentru un singur client
      </footer>
    </div>
  );
}
