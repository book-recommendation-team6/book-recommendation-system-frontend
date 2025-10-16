// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { setAuthData, getAuthData, getToken, clearAuthData } from "../utils/storage";
import { login as loginService, register as registerService, getUser } from "../services/authService";
import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jwt, setJwt] = useState(getToken());

  // Initialize Auth state from localStorage
  useEffect(() => {
    const storedUser = getAuthData().user;
    if (storedUser) {
        setUser(storedUser);
    } else {
      console.error("Error retrieving auth data");
      setUser(null);
    }
    setLoading(false);
  }, []);

  const fetchUserProfile = useCallback(async () => {
        const token = getToken();
        console.log("Fetching user profile with token:", token);
        if (!token) return null;
        setLoading(true);
        try {
            const userData = await getUser();
            console.log("✅ User profile fetched successfully:", userData);
            setUser(userData);
            setAuthData(token, userData);
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

  // Login function
  const login = useCallback(async (email_input, password) => {
    setLoading(true);
    try {
      const response = await loginService(email_input, password);
      const { jwt, id, username, email, role } = response;
      const userData = { id, username, email, role };
      setAuthData(jwt, userData);
      setUser(userData);
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
  }, []);

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
