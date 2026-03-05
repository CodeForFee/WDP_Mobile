import { useAuth } from '@/hooks/useAuth';
import { handleErrorApi } from '@/lib/errors';
import { useSessionStore } from '@/stores/storeSession';
import { router } from 'expo-router';
import { createContext, useContext, ReactNode } from 'react';

/* ================= TYPES ================= */

interface AuthContextProps {
  isAuthenticated: boolean;
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
  const { logoutMutation } = useAuth();

  const logout = async (): Promise<void> => {
    const refreshToken = session.refreshToken;

    if (refreshToken) {
      try {
        await logoutMutation.mutateAsync(refreshToken);
      } catch (error) {
        handleErrorApi({ error });
      }
    }

    await session.logout();
    router.replace('/(auth)/login');
  };

  const value: AuthContextProps = {
    isAuthenticated: session.isAuthenticated,
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
