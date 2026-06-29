import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("equora_token");
    const storedUser = localStorage.getItem("equora_user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function persistSession(authResponse) {
    const { token, userId, name, email } = authResponse;
    const sessionUser = { userId, name, email };

    localStorage.setItem("equora_token", token);
    localStorage.setItem("equora_user", JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  }

  async function login(credentials) {
    const res = await loginUser(credentials);
    return persistSession(res);
  }

  async function register(details) {
    const res = await registerUser(details);
    return persistSession(res);
  }

  function logout() {
    localStorage.removeItem("equora_token");
    localStorage.removeItem("equora_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
