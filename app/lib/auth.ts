import axios from "axios";

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "CLINICIAN" | "STAFF";
  must_change_password?: boolean;
};

type AuthSessionResponse = {
  accessToken: string;
  user?: AuthUser;
};

const defaultApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://api.cliniq.cloud");

export const API_BASE_URL = defaultApiBaseUrl;
export const API_KEY =
  process.env.NEXT_PUBLIC_API_KEY || "icdms_2026_ntccgfjck";

const ACCESS_TOKEN_KEY = "token";
const USER_KEY = "user";

const isBrowser = () => typeof window !== "undefined";

export const getAccessToken = (): string | null => {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getStoredUser = (): AuthUser | null => {
  if (!isBrowser()) return null;

  const rawUser = window.localStorage.getItem(USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    clearAuthState();
    return null;
  }
};

export const setAuthSession = (session: AuthSessionResponse) => {
  if (!isBrowser()) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);

  if (session.user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  }
};

export const clearAuthState = () => {
  if (!isBrowser()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
};

export const getRouteForRole = (role?: AuthUser["role"]) => {
  if (role) return "/dashboard";
  return "/login";
};

export const redirectToLogin = () => {
  if (!isBrowser()) return;
  window.location.href = "/login";
};

export const refreshSession = async () => {
  const response = await axios.post<AuthSessionResponse>(
    `${API_BASE_URL}/auth/refresh`,
    {},
    {
      withCredentials: true,
      headers: {
        "x-api-key": API_KEY
      }
    }
  );

  setAuthSession(response.data);
  return response.data.accessToken;
};

export const logoutSession = async () => {
  try {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          "x-api-key": API_KEY
        }
      }
    );
  } finally {
    clearAuthState();
  }
};
