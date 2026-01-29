

import envconfig from '@/config';
import { useSessionStore } from '@/stores/storeSession';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { AUTH_ENDPOINT } from './endpoint';
import { ResponseData } from '@/type';




/* ================= CREATE INSTANCE ================= */

export const api = axios.create({
  baseURL: envconfig.EXPO_PUBLIC_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useSessionStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      if (token && promise.config.headers) {
        promise.config.headers.Authorization = `Bearer ${token}`;
      }
      promise.resolve(api(promise.config));
    }
  });

  failedQueue = [];
};


api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      const session = useSessionStore.getState();

      if (!session.refreshToken) {
        session.logout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            config: originalRequest,
          });
        });
      }

      isRefreshing = true;

      try {
        const res : ResponseData<{ accessToken: string,refreshToken: string }> = await axios.post(
          `${envconfig.EXPO_PUBLIC_BASE_URL}${AUTH_ENDPOINT.REFRESH}`,
          {
            refreshToken: session.refreshToken,
          }
        );

      

        await session.refresh(res.data.accessToken, res.data.refreshToken);

        processQueue(null, res.data.accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        session.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
