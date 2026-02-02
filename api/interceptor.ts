import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import envconfig from "@/config";
import { ENDPOINT } from "./endpoint";
import { HttpErrorCode } from "@/enum";
import { EntityError, HttpError } from "@/lib/errors";
import { useSessionStore } from "@/stores/storeSession";
import { ResponseData, ResponseError } from "@/type";

/* ================= AXIOS INSTANCE ================= */

export const api = axios.create({
  baseURL: envconfig.EXPO_PUBLIC_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
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

/* ================= REFRESH TOKEN QUEUE ================= */

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

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ResponseError>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    /* ========== 401 – REFRESH TOKEN ========== */

    if (
      error.response?.status === HttpErrorCode.UNAUTHORIZED &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(ENDPOINT.REFRESH)
    ) {
      const session = useSessionStore.getState();

      if (!session.refreshToken) {
        session.logout();

        return Promise.reject(
          new HttpError(HttpErrorCode.UNAUTHORIZED, {
            statusCode: HttpErrorCode.UNAUTHORIZED,
            message: "Phiên đăng nhập đã hết hạn",
            error: "Unauthorized",
            timestamp: new Date().toISOString(),
            path: originalRequest.url ?? "",
          })
        );
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
        const res = await axios.post<
          ResponseData<{ accessToken: string; refreshToken: string }>
        >(`${envconfig.EXPO_PUBLIC_BASE_URL}${ENDPOINT.REFRESH}`, {
          refreshToken: session.refreshToken,
        });

        await session.refresh(
          res.data.data.accessToken,
          res.data.data.refreshToken
        );

        processQueue(null, res.data.data.accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        session.logout();

        return Promise.reject(
          new HttpError(HttpErrorCode.UNAUTHORIZED, {
            statusCode: HttpErrorCode.UNAUTHORIZED,
            message: "Phiên đăng nhập đã hết hạn",
            error: "Unauthorized",
            timestamp: new Date().toISOString(),
            path: originalRequest.url ?? "",
          })
        );
      } finally {
        isRefreshing = false;
      }
    }

    /* ========== BACKEND ERROR ========== */

    if (error.response?.data) {
      const data = error.response.data;

     
      if (
        (data.statusCode === HttpErrorCode.BAD_REQUEST || data.statusCode === HttpErrorCode.UNPROCESSABLE_ENTITY) &&
        "errors" in data &&
        Array.isArray((data as any).errors)
      ) {
        return Promise.reject(new EntityError(data));
      }


      return Promise.reject(
        new HttpError(data.statusCode, data)
      );
    }

    /* ========== NETWORK ERROR ========== */

    if (error.request) {
      return Promise.reject(
        new HttpError(HttpErrorCode.INTERNAL_SERVER_ERROR, {
          statusCode: HttpErrorCode.INTERNAL_SERVER_ERROR,
          message: "Không thể kết nối server",
          error: "Network Error",
          timestamp: new Date().toISOString(),
          path: originalRequest.url ?? "",
        })
      );
    }

    /* ========== UNKNOWN ERROR ========== */

    return Promise.reject(
      new HttpError(HttpErrorCode.INTERNAL_SERVER_ERROR, {
        statusCode: HttpErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message || "Có lỗi xảy ra",
        error: "Unknown Error",
        timestamp: new Date().toISOString(),
        path: originalRequest.url ?? "",
      })
    );
  }
);

export default api;
