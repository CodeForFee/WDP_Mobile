import { useAuth } from '@/hooks/useAuth';
import { LoginInput } from '@/schemas/authSchema';
import { useSessionStore } from '@/stores/storeSession';
import { router } from 'expo-router';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

/* ================= TYPES ================= */

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginInput: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/* ================= PROVIDER ================= */

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const session = useSessionStore();
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from secure store on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        await session.hydrate();
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (loginInput: LoginInput): Promise<void> => {
    // call api
    const res = await useAuth.login(loginInput);

    // set auth in zustand
    if (res?.accessToken && res?.refreshToken) {
      await session.login(res.accessToken, res.refreshToken);
      // redirerct home
        router.replace('/(franchise-staff)');
    }
  };

  const logout = async (): Promise<void> => {
    const refreshToken = session.refreshToken;

    if (refreshToken) {
      // call api logout (optional — backend dependent)
      await useAuth.logout(refreshToken);
    }

    // clear auth in zustand
    await session.logout();
    // redirect to login
    router.replace('/(auth)/login');
  };

  const value: AuthContextProps = {
    isAuthenticated: session.isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuthContext must be used within AuthProvider'
    );
  }

  return context;
};
