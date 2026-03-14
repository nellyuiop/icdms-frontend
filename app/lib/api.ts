import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  API_BASE_URL,
  API_KEY,
  clearAuthState,
  getAccessToken,
  redirectToLogin,
  refreshSession,
} from "@/app/lib/auth";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type ApiErrorPayload = {
  message?: string;
  code?: string;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  config.headers["x-api-key"] = API_KEY;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const errorCode = error.response?.data?.code;
    const isExpiredAccessToken =
      error.response?.status === 401 && errorCode === "AUTH_TOKEN_EXPIRED";
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 403 && errorCode === "PASSWORD_CHANGE_REQUIRED") {
      window.location.href = "/change-password";
      return Promise.reject(error);
    }

    if (!originalRequest || !isExpiredAccessToken || originalRequest._retry || isRefreshCall) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= refreshSession().finally(() => {
        refreshPromise = null;
      });

      const nextAccessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAuthState();
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
