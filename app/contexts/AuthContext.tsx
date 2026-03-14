"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getStoredUser,
  getAccessToken,
  type AuthUser,
} from "@/app/lib/auth";

type AuthContextType = {
  user: AuthUser;
  role: AuthUser["role"];
  isAdmin: boolean;
  isClinician: boolean;
  isStaff: boolean;
  hasRole: (role: AuthUser["role"]) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [auth, setAuth] = useState<{ user: AuthUser; token: string } | null>(
    null
  );
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    const user = getStoredUser();

    if (!token || !user) {
      router.replace("/login");
    } else if (user.must_change_password && pathname !== "/change-password") {
      router.replace("/change-password");
    } else {
      setAuth({ user, token }); // eslint-disable-line react-hooks/set-state-in-effect -- reading from localStorage (external store) on mount
      setChecked(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!checked || !auth) {
    return null;
  }

  const { user } = auth;
  const role = user.role;

  const value: AuthContextType = {
    user,
    role,
    isAdmin: role === "ADMIN",
    isClinician: role === "CLINICIAN",
    isStaff: role === "STAFF",
    hasRole: (r) => role === r,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
