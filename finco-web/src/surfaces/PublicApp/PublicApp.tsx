import { Navigate, Route, Routes } from "react-router-dom";
import { PublicShell } from "@surfaces/PublicApp/PublicShell/PublicShell";
import { Home } from "@pages/public/Home/Home";
import { Upload } from "@pages/public/Upload/Upload";
import { RequestLink } from "@pages/public/RequestLink/RequestLink";
import { ROUTES } from "@constants/routes";

// Containerul suprafetei publice. Paginile "de site" (Home, Cere link) isi poarta
// propriul chenar (SiteLayout) si sunt interconectate; fluxul de upload legat prin
// token ramane in chenarul minimal, focusat (PublicShell) si este noindex.
export default function PublicApp() {
  return (
    <Routes>
      {/* Site-ul de prezentare al cabinetului. */}
      <Route index element={<Home />} />

      {/* Cere un link nou: pagina publica de sine statatoare (chenar complet). */}
      <Route path="cere-link" element={<RequestLink />} />

      {/* Flux de upload legat prin token: chenar minimal, focusat. */}
      <Route
        path="upload/:token"
        element={
          <PublicShell seoTitle="Incarca documente — FINCO Expert">
            <Upload />
          </PublicShell>
        }
      />

      <Route path="*" element={<Navigate to={ROUTES.PUBLIC.HOME} replace />} />
    </Routes>
  );
}
