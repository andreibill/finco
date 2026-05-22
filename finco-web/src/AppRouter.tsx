import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Splash } from "./surfaces/InternalApp/Splash";
import { APP_PREFIX } from "./constants/routes";

// Fiecare suprafata se incarca lazy: vizitatorul public nu descarca bundle-ul
// cabinetului si invers.
const InternalApp = lazy(() => import("./surfaces/InternalApp/InternalApp"));
const PublicApp = lazy(() => import("./surfaces/PublicApp/PublicApp"));

export function AppRouter() {
  return (
    <Suspense fallback={<Splash />}>
      <Routes>
        {/* Prefixul /app exista doar in prototip (in prod: subdomeniul app.finco.ro). */}
        <Route path={`${APP_PREFIX}/*`} element={<InternalApp />} />
        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </Suspense>
  );
}
