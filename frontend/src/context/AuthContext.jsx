import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const refreshUser = useCallback(async () => {
    const result = await api.getMyProfile();
    const current = result?.data?.user;
    if (!current) throw new Error("Profile data is unavailable.");
    setUser(current);
    return current;
  }, []);
  useEffect(() => {
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) return;
    queueMicrotask(() => { refreshUser().catch(() => setUser(null)); });
  }, [refreshUser]);
  return <AuthContext.Provider value={{ user, setUser, refreshUser }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
