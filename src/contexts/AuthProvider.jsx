// src/contexts/AuthContext.jsx
import React, { useState, useEffect, useCallback } from "react";
import { login as loginService, register as registerService, getUser } from "../services/authService";
import { AuthContext } from "./AuthContext";
import { clearAuthData, getAuthData, getToken, setAuthData } from "../utils/storage";

const normalizeUser = (userData = {}) => {
  if (!userData || typeof userData !== "object") return null;

  const { password, role: rawRole, roleName: roleNameFromResponse, ...rest } = userData;
  const roleName =
    typeof rawRole === "string"
      ? rawRole
      : rawRole?.name || roleNameFromResponse || rawRole?.authority || "";

  return {
    ...rest,
    role: roleName,
    roleName,
    isAdmin: roleName?.toUpperCase() === "ADMIN",
  };
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jwt, setJwt] = useState(getToken());

  console.log("AuthProvider rendered. Current user:", user);

  const fetchUserProfile = useCallback(async () => {
    const token = getToken();
    console.log("Fetching user profile with token:", token);
    if (!token) return null;
    setLoading(true);
    try {
      const userData = await getUser();
      console.log("✅ User profile fetched successfully:", userData);
      const normalizedUser = normalizeUser(userData);
      setUser(normalizedUser);
      setAuthData(token, normalizedUser);
      setError(null);
      return userData;
    } catch (err) {
      console.error("❌ Lỗi khi lấy user:", err);
      if (err.response?.status === 401) {
        clearAuthData();
        setUser(null);
        setJwt(null);
      }
      setError("Phiên đăng nhập hết hạn.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize Auth state from localStorage
  useEffect(() => {
    const { token, user: storedUser } = getAuthData();
    if (storedUser) {
      setUser(storedUser);
    }

    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Login function
  const login = useCallback(async (email_input, password) => {
    setLoading(true);
    try {
      const response = await loginService(email_input, password);
      const { jwt, id, username, email, role } = response;
      const userData = normalizeUser({ id, username, email, role });
      setAuthData(jwt, userData);
      setJwt(jwt);
      setUser(userData);
      await fetchUserProfile();
      return {
        success: true,
        token: jwt,
        data: userData,
      };
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error(error?.response?.data.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Register function
  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await registerService(userData);
      console.log("Register response:", response);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Register failed:", error);
      return {
        success: false,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    try {
      clearAuthData();
      setUser(null);
      return { success: true, message: "Logout successful" };
    } catch (error) {
      console.error("Logout operation failed:", error);
    }
  }, []);

  // Update user profile
  // const updateProfile = useCallback((updatedData) => {
  //   const updatedUser = { ...user, ...updatedData };
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  //   setUser(updatedUser);
  // }, [user]);

  const setAuthTokenAndFetchUser = useCallback(async (token) => {
    if (!token) return;
    setAuthData(token, null);
    setJwt(token);
    await fetchUserProfile();
  }, [fetchUserProfile]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    fetchUserProfile,
    setAuthTokenAndFetchUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
