import { Navigate, Route, Routes } from "react-router-dom";
import { PublicShell } from "../../pages/public/PublicShell/PublicShell";
import { UploadPage } from "../../pages/public/UploadPage/UploadPage";
import { RequestLinkPage } from "../../pages/public/RequestLinkPage/RequestLinkPage";
import { ROUTES } from "../../constants/routes";

// Token demo pentru radacina publica (in prod link-ul real vine pe email).
const DEMO_TOKEN = "demo";

// Containerul suprafetei publice. Starile upload / expirat / dupa-upload se ating
// prin rutare + stare interna a UploadPage (nu printr-un switcher).
export default function PublicApp() {
  return (
    <PublicShell>
      <Routes>
        {/* Radacina arata fluxul de upload (link demo). */}
        <Route index element={<Navigate to={ROUTES.PUBLIC.UPLOAD(DEMO_TOKEN)} replace />} />
        <Route path="upload/:token" element={<UploadPage />} />
        <Route path="cere-link" element={<RequestLinkPage />} />
        <Route path="*" element={<Navigate to={ROUTES.PUBLIC.UPLOAD(DEMO_TOKEN)} replace />} />
      </Routes>
    </PublicShell>
  );
}
