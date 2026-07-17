import { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api';
import { setAccessToken } from '../api/axiosClient';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, attempt a silent refresh to restore the session from the
  // httpOnly cookie (page reload wipes in-memory access token by design).
  useEffect(() => {
    async function bootstrap() {
      try {
        const { data } = await authApi.refresh();
        setAccessToken(data.data.accessToken);
        const me = await authApi.getMe();
        setUser(me.data.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials);
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
