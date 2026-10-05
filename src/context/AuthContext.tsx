import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/user';

interface AuthContextType extends AuthState {
  token?: string;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const DEMO_USER: User = {
  id: 'u001',
  name: 'Arjun Mehta',
  email: 'demo@titanova.com',
  phone: '9876543210',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem('titanova_token') || sessionStorage.getItem('titanova_token') || undefined;
    } catch {
      return undefined;
    }
  });

  const [state, setState] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem('titanova_user') || sessionStorage.getItem('titanova_user');
      if (saved) {
        const user = JSON.parse(saved) as User;
        return { user, isAuthenticated: true, isLoading: false };
      }
    } catch {
      /* ignore parse error */
    }
    return { user: null, isAuthenticated: false, isLoading: false };
  });

  // Verify session on mount with server if token exists
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('titanova_token') || sessionStorage.getItem('titanova_token');
      if (!savedToken) return;

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setState({ user: data.user, isAuthenticated: true, isLoading: false });
          }
        } else if (res.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('titanova_token');
          sessionStorage.removeItem('titanova_token');
          localStorage.removeItem('titanova_user');
          sessionStorage.removeItem('titanova_user');
          setState({ user: null, isAuthenticated: false, isLoading: false });
          setToken(undefined);
        }
      } catch {
        // Server may be offline; retain local state
      }
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string, rememberMe = true) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data: { success?: boolean; user?: User; token?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok && data.success && data.user && data.token) {
        const user: User = data.user;
        const authToken: string = data.token;

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('titanova_token', authToken);
        storage.setItem('titanova_user', JSON.stringify(user));

        setToken(authToken);
        setState({ user, isAuthenticated: true, isLoading: false });
        return { success: true };
      } else if (res.status === 400 || res.status === 401) {
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: data.error || 'Invalid email or password.' };
      } else {
        throw new Error(data.error || 'Server unreachable');
      }
    } catch {
      // Resilient fallback for standalone dev / preview when backend is not active
      if (
        (email === 'demo@titanova.com' && password === 'demo123') ||
        (email.includes('@') && password.length >= 6)
      ) {
        const user: User =
          email === 'demo@titanova.com'
            ? DEMO_USER
            : { id: 'u' + Date.now(), name: email.split('@')[0], email };

        const fallbackToken = 'dev_token_' + Date.now();
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('titanova_token', fallbackToken);
        storage.setItem('titanova_user', JSON.stringify(user));

        setToken(fallbackToken);
        setState({ user, isAuthenticated: true, isLoading: false });
        return { success: true };
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Could not connect to authentication service.' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      let data: { success?: boolean; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok && data.success) {
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: true };
      } else if (res.status === 400) {
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: data.error || 'Failed to create account.' };
      } else {
        throw new Error(data.error || 'Server unreachable');
      }
    } catch {
      // Fallback
      if (name.trim() && email.includes('@') && password.length >= 6) {
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: true };
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Could not reach registration server.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('titanova_token');
    sessionStorage.removeItem('titanova_token');
    localStorage.removeItem('titanova_user');
    sessionStorage.removeItem('titanova_user');
    setToken(undefined);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
