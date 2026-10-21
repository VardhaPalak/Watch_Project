import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, getToken, setToken } from "../lib/api";
import type { AdminUser } from "../types";

interface AuthContextValue {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(true);

  const persistToken = useCallback((next: string | null) => {
    setToken(next);
    setTokenState(next);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.post<{ token: string; user: AdminUser }>(
        "/auth/login",
        { email, password },
      );
      setUser(data.user);
      persistToken(data.token);
    },
    [persistToken],
  );

  const logout = useCallback(() => {
    setUser(null);
    persistToken(null);
  }, [persistToken]);

  useEffect(() => {
    let active = true;
    const existing = getToken();
    if (!existing) {
      setLoading(false);
      return;
    }
    api
      .get<{ user: AdminUser }>("/auth/me", { auth: true })
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch((err) => {
        if (err instanceof Error && (err as { status?: number }).status === 401) {
          persistToken(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [persistToken]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, login, logout, isAdmin: user?.role === "admin" }),
    [user, token, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}