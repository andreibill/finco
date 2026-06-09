import { Navigate, Route, Routes } from "react-router-dom";
import { PublicShell } from "@surfaces/PublicApp/PublicShell/PublicShell";
import { Home } from "@pages/public/Home/Home";
import { Upload } from "@pages/public/Upload/Upload";
import { RequestLink } from "@pages/public/RequestLink/RequestLink";
import { ROUTES } from "@constants/routes";

// Containerul suprafetei publice. Radacina este site-ul de prezentare (Home);
// fluxurile de upload pastreaza chenarul lor (PublicShell) si sunt noindex.
export default function PublicApp() {
  return (
    <Routes>
      {/* Site-ul de prezentare al cabinetului. */}
      <Route index element={<Home />} />

      {/* Fluxuri publice legate prin token, in chenarul de upload. */}
      <Route
        path="upload/:token"
        element={
          <PublicShell seoTitle="Incarca documente — FINCO Expert">
            <Upload />
          </PublicShell>
        }
      />
      <Route
        path="cere-link"
        element={
          <PublicShell seoTitle="Cere un link nou — FINCO Expert">
            <RequestLink />
          </PublicShell>
        }
      />

      <Route path="*" element={<Navigate to={ROUTES.PUBLIC.HOME} replace />} />
    </Routes>
  );
}
