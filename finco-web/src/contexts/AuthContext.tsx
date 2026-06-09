import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, type LoginCredentials } from "@services/auth.service";
import { ROUTES } from "@constants/routes";
import type { User } from "@types";

// Cheile de persistenta a sesiunii mock. In prod tokenul ar fi cookie httpOnly
// (NU in JS); aici doar simulam restaurarea sesiunii la reload.
const STORAGE_AUTHED = "finco.authed";
const STORAGE_USER = "finco.user";

type AuthContextValue = {
  user: User | null;
  authed: boolean;
  isAdmin: boolean;
  isHydrating: boolean;
  login: (creds: LoginCredentials) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const navigate = useNavigate();

  // Faza 1: la prima incarcare incercam sa refacem sesiunea (mock: localStorage).
  useEffect(() => {
    try {
      const authed = localStorage.getItem(STORAGE_AUTHED) === "true";
      const raw = localStorage.getItem(STORAGE_USER);
      if (authed && raw) {
        setUser(JSON.parse(raw) as User);
      }
    } catch {
      // ignora storage corupt
    } finally {
      setIsHydrating(false);
    }
  }, []);

  const login = useCallback(async (creds: LoginCredentials) => {
    const res = await authService.login(creds);
    if (res.status === "error" || !res.data) {
      throw new Error(res.message);
    }
    setUser(res.data);
    try {
      localStorage.setItem(STORAGE_AUTHED, "true");
      localStorage.setItem(STORAGE_USER, JSON.stringify(res.data));
    } catch {
      // ignora
    }
  }, []);

  const logout = useCallback(() => {
    void authService.logout();
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_AUTHED);
      localStorage.removeItem(STORAGE_USER);
    } catch {
      // ignora
    }
    navigate(ROUTES.APP.LOGIN, { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ user, authed: !!user, isAdmin: !!user?.isAdmin, isHydrating, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth trebuie folosit in interiorul AuthProvider");
  return ctx;
}

// Randeaza copiii doar pentru un administrator. Pentru angajatii obisnuiti
// afiseaza optional un fallback (implicit nimic). Folosit pentru a ascunde
// actiuni/sectiuni rezervate adminilor in paginile cabinetului.
export function AdminOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isAdmin } = useAuth();
  return <>{isAdmin ? children : fallback}</>;
}
