import { useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { RequestModalContext } from "../../contexts/RequestModalContext";
import { LayoutContext } from "./LayoutContext";
import { Splash } from "./Splash";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { RequestDocumentsModal } from "../../pages/RequestDocumentsModal/RequestDocumentsModal";
import { LoginScreen } from "../../pages/LoginScreen/LoginScreen";
import { LibraryScreen } from "../../pages/LibraryScreen/LibraryScreen";
import { ClientDetailScreen } from "../../pages/ClientDetailScreen/ClientDetailScreen";
import { PeriodDetailScreen } from "../../pages/PeriodDetailScreen/PeriodDetailScreen";
import { RequestsScreen } from "../../pages/RequestsScreen/RequestsScreen";
import { SettingsScreen } from "../../pages/SettingsScreen/SettingsScreen";
import { ROUTES } from "../../constants/routes";
import type { Client } from "../../types";
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

// Auth gate cu doua faze: hidratare (Splash) -> login / shell.
function InternalRoutes() {
  const { authed, isHydrating } = useAuth();

  if (isHydrating) return <Splash />;

  return (
    <Routes>
      <Route
        path="login"
        element={authed ? <Navigate to={ROUTES.APP.BIBLIOTECA} replace /> : <LoginScreen />}
      />
      <Route element={authed ? <ShellLayout /> : <Navigate to={ROUTES.APP.LOGIN} replace />}>
        <Route index element={<Navigate to={ROUTES.APP.BIBLIOTECA} replace />} />
        <Route path="biblioteca" element={<LibraryScreen />} />
        <Route path="clienti/:id" element={<ClientDetailScreen />} />
        <Route path="clienti/:id/perioade/:periodId" element={<PeriodDetailScreen />} />
        <Route path="cereri" element={<RequestsScreen />} />
        <Route path="setari" element={<SettingsScreen />} />
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
