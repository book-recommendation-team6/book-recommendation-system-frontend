// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  setAuthData,
  getAuthData,
  getToken,
  clearAuthData,
} from "../utils/storage";
import {
  login as loginService,
  register as registerService,
} from "../services/authService";
import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Login function
  const login = useCallback(async (email_input, password) => {
    setLoading(true);
    try {
      const response = await loginService(email_input, password);
      console.log("Login response:", response);
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
      return {
        success: false,
        error: error?.response?.data.message || "Login failed",
        data: null,
        token: null,
      };
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
      const { jwt, id, username, email, role } = response;
      const newUser = { id, username, email, role };
      setAuthData(jwt, newUser);
      setUser(newUser);
      return {
        success: true,
        token: jwt,
        data: newUser,
      };
    } catch (error) {
      console.error("Register failed:", error);
      return {
        success: false,
        error: error?.response?.data.message || "Register failed",
        data: null,
        token: null,
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

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
