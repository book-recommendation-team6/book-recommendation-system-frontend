// src/hooks/useAuth.jsx
import { useState} from "react";
import { login, register } from "../services/authService.js";
import { clearAuthData, setAuthData } from "../utils/storage";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setLoading(true);

    try {
      const response = await login(credentials);
      const { jwt, id, username, email, role } = response;
      const userData = { id, username, email, role };
      setAuthData(jwt, userData);
      return {
        success: true,
        token: jwt,
        data: userData,
      };
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data.message || "Login failed",
        data: null,
        token: null,
      };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    try {
      const apiResponse = await register(userData);
      return {
        success: true,
        data: apiResponse,
        message: "Registration successful",
      };
    } catch (error) {
      console.error("Registration operation failed:", error);
      return {
        success: false,
        error: error.message || "Registration failed",
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      clearAuthData();
      return { success: true, message: "Logout successful" };
    } catch (error) {
      console.error("Logout operation failed:", error);
    }
  };

  return {
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};