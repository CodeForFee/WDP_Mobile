import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { decodeJWT } from '@/lib/utils';


/* ================= TYPES ================= */

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  storeId?: string;
  iat: number;
  exp: number;
};

interface SessionState {
  accessToken: string | null;
  refreshToken: string | null;
  user: JwtPayload | null;

  isAuthenticated: boolean;

  hydrate: () => Promise<void>;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  refresh: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

/* ================= STORE ================= */

export const useSessionStore = create<SessionState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  /* Load session from SecureStore */
  hydrate: async () => {
    const accessToken = await SecureStore.getItemAsync('access_token');
    const refreshToken = await SecureStore.getItemAsync('refresh_token');

    if (!accessToken || !refreshToken) return;

    const decoded = decodeJWT<JwtPayload>(accessToken);

    // expired token → logout luôn
    if (decoded.exp * 1000 < Date.now()) {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      return;
    }

    set({
      accessToken,
      refreshToken,
      user: decoded,
      isAuthenticated: true,
    });
  },

  /* Login */
  login: async (accessToken, refreshToken) => {
    const decoded = decodeJWT<JwtPayload>(accessToken);

    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);

    set({
      accessToken,
      refreshToken,
      user: decoded,
      isAuthenticated: true,
    });
  },

  /* Refresh access token */
  refresh: async (accessToken, refreshToken) => {
    const decoded = decodeJWT<JwtPayload>(accessToken);

    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);

    set({
      accessToken,
      refreshToken,
      user: decoded,
      isAuthenticated: true,
    });
  },

  /* Logout */
  logout: async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
