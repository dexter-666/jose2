import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { AuthUser, UserRole } from '../types/stock';

interface LoginResult {
  success: boolean;
  error?: string;
  role?: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (username: string, pass: string) => LoginResult;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'gerdau_siderperu_auth_session_v1';

const AuthContext = createContext<AuthContextValue | null>(null);

function getPersistedUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw =
      window.sessionStorage.getItem(AUTH_STORAGE_KEY) ||
      window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (
      parsed &&
      (parsed.role === 'despachador' || parsed.role === 'balanza') &&
      typeof parsed.username === 'string'
    ) {
      return {
        username: parsed.username,
        role: parsed.role,
        displayName: parsed.displayName ?? parsed.username,
      };
    }
  } catch {
    // Ignore storage parse errors
  }
  return null;
}

function persistUser(user: AuthUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      const serial = JSON.stringify(user);
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, serial);
      window.localStorage.setItem(AUTH_STORAGE_KEY, serial);
    } else {
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // Ignore storage write errors
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getPersistedUser());

  useEffect(() => {
    persistUser(user);
  }, [user]);

  const login = useCallback((rawUsername: string, rawPassword: string): LoginResult => {
    const username = (rawUsername ?? '').trim();
    const password = (rawPassword ?? '').trim();

    if (!username || !password) {
      return {
        success: false,
        error: 'Ingresa tu usuario y contraseña para continuar.',
      };
    }

    const lowerUser = username.toLowerCase();

    // 1) Despachador: Usuario "Despachador", Contraseña "Almacen2026"
    if (lowerUser === 'despachador' && password === 'Almacen2026') {
      const loggedUser: AuthUser = {
        username: 'Despachador',
        role: 'despachador',
        displayName: 'Despachador (Almacén)',
      };
      setUser(loggedUser);
      persistUser(loggedUser);
      return { success: true, role: 'despachador' };
    }

    // 2) Balancero: Usuario "Balancero", Contraseña "Balanza2026"
    if ((lowerUser === 'balancero' || lowerUser === 'balanzero') && password === 'Balanza2026') {
      const loggedUser: AuthUser = {
        username: 'Balancero',
        role: 'balanza',
        displayName: 'Balancero (Balanza)',
      };
      setUser(loggedUser);
      persistUser(loggedUser);
      return { success: true, role: 'balanza' };
    }

    return {
      success: false,
      error: 'Credenciales inválidas. Verifica usuario y contraseña.',
    };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    role: user?.role ?? null,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
