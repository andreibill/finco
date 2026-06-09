import { useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@contexts/AuthContext";
import { RequestModalContext } from "@contexts/RequestModalContext";
import { BibliotecaPeriodProvider } from "@contexts/BibliotecaPeriodContext";
import { LayoutContext } from "@surfaces/InternalApp/LayoutContext";
import { Splash } from "@surfaces/InternalApp/Splash";
import { Sidebar } from "@components";
import { RequestDocumentsModal } from "@components/modals/RequestDocumentsModal/RequestDocumentsModal";
import { Login } from "@pages/public/Login/Login";
import { Library } from "@pages/private/Library/Library";
import { BibliotecaClient } from "@pages/private/BibliotecaClient/BibliotecaClient";
import { Clienti } from "@pages/private/Clienti/Clienti";
import { ClientDetail } from "@pages/private/ClientDetail/ClientDetail";
import { PeriodDetail } from "@pages/private/PeriodDetail/PeriodDetail";
import { Requests } from "@pages/private/Requests/Requests";
import { Settings } from "@pages/private/Settings/Settings";
import { ROUTES } from "@constants/routes";
import type { Client } from "@types";
import "./InternalApp.css";

// Cadrul de layout (Shell): Sidebar + main cu Outlet. Tine si overlay-urile
// globale: RequestDocumentsModal + drawer-ul de Sidebar pe mobil.
function ShellLayout() {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // undefined = inchis; null = deschis fara client preselectat.
  const [modalClient, setModalClient] = useState<Client | null | undefined>(undefined);

  if (!user) return null;

  const openRequestModal = (client: Client | null) => setModalClient(client);
  const closeRequestModal = () => setModalClient(undefined);

  return (
    <RequestModalContext.Provider value={{ openRequestModal }}>
      <LayoutContext.Provider value={{ toggleSidebar: () => setDrawerOpen((o) => !o) }}>
        <div className={`shell${drawerOpen ? " shell--drawer-open" : ""}`}>
          {drawerOpen && <div className="shell__overlay" onClick={() => setDrawerOpen(false)} />}
          <div className="shell__sidebar">
            <Sidebar user={user} onLogout={logout} onNavigate={() => setDrawerOpen(false)} />
          </div>
          <main className="shell__main">
            <Outlet />
          </main>
        </div>
        <RequestDocumentsModal
          open={modalClient !== undefined}
          client={modalClient ?? null}
          onClose={closeRequestModal}
        />
      </LayoutContext.Provider>
    </RequestModalContext.Provider>
  );
}

// Layout pentru suprafata Biblioteca: ofera contextul de perioada partajat
// intre lista (/biblioteca) si detaliul clientului (/biblioteca/:id).
function BibliotecaLayout() {
  return (
    <BibliotecaPeriodProvider>
      <Outlet />
    </BibliotecaPeriodProvider>
  );
}

// Auth gate cu doua faze: hidratare (Splash) -> login / shell.
function InternalRoutes() {
  const { authed, isHydrating } = useAuth();

  if (isHydrating) return <Splash />;

  return (
    <Routes>
      <Route
        path="login"
        element={authed ? <Navigate to={ROUTES.APP.BIBLIOTECA} replace /> : <Login />}
      />
      <Route element={authed ? <ShellLayout /> : <Navigate to={ROUTES.APP.LOGIN} replace />}>
        <Route index element={<Navigate to={ROUTES.APP.BIBLIOTECA} replace />} />
        {/* Suprafata Biblioteca imparte o singura perioada selectata. */}
        <Route element={<BibliotecaLayout />}>
          <Route path="biblioteca" element={<Library />} />
          <Route path="biblioteca/:id" element={<BibliotecaClient />} />
        </Route>
        <Route path="clienti" element={<Clienti />} />
        <Route path="clienti/:id" element={<ClientDetail />} />
        <Route path="clienti/:id/perioade/:periodId" element={<PeriodDetail />} />
        <Route path="cereri" element={<Requests />} />
        <Route path="setari" element={<Settings />} />
        <Route path="*" element={<Navigate to={ROUTES.APP.BIBLIOTECA} replace />} />
      </Route>
    </Routes>
  );
}

export default function InternalApp() {
  return (
    <AuthProvider>
      <InternalRoutes />
    </AuthProvider>
  );
}
