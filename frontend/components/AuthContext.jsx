"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("swastha_user") || sessionStorage.getItem("swastha_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, remember = true) => {
    // Simulated authentication
    await new Promise((res) => setTimeout(res, 600));
    
    const namePart = email.split("@")[0].replace(/[._]/g, " ");
    const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const userData = {
      name: name || "User",
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      provider: "email",
      loggedInAt: new Date().toISOString(),
    };

    setUser(userData);
    if (remember) {
      localStorage.setItem("swastha_user", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("swastha_user", JSON.stringify(userData));
    }
    return { success: true, user: userData };
  };

  const signup = async (name, email, password) => {
    // Simulated signup
    await new Promise((res) => setTimeout(res, 700));

    const userData = {
      name: name.trim() || "New User",
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email || name)}`,
      provider: "email",
      loggedInAt: new Date().toISOString(),
    };

    setUser(userData);
    localStorage.setItem("swastha_user", JSON.stringify(userData));
    return { success: true, user: userData };
  };

  const loginWithGoogle = async () => {
    // Simulated Google OAuth login / signup
    await new Promise((res) => setTimeout(res, 900));

    const googleUser = {
      name: "Swastha User",
      email: "user.swastha@gmail.com",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      provider: "google",
      loggedInAt: new Date().toISOString(),
    };

    setUser(googleUser);
    localStorage.setItem("swastha_user", JSON.stringify(googleUser));
    return { success: true, user: googleUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("swastha_user");
    sessionStorage.removeItem("swastha_user");
  };

  const resetPassword = async (email) => {
    await new Promise((res) => setTimeout(res, 600));
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
