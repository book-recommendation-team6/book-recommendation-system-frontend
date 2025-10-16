import React, { createContext, useState, useCallback, useContext } from "react";
import { getAuthData, setAuthData, clearAuthData, getToken } from "../utils/storage.js";
import { login as loginApi, register as registerApi } from "../services/authService.js";
import api from "../config/ApiConfig.js";

// 👉 Khai báo Context
export const AuthContext = createContext(null);

// 👉 Provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getAuthData().user);
    const [jwt, setJwt] = useState(getToken());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUserProfile = useCallback(async () => {
        const token = getToken();
        if (!token) return null;
        setIsLoading(true);
        try {
            const userData = await api.get("/users/profile");
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
            setIsLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await loginApi(email, password);
            const token = response?.token || response?.accessToken || response?.data?.token;
            const userData = response?.user || response?.data?.user;

            if (!token) throw new Error("Không nhận được token từ server");

            setAuthData(token, userData);
            setJwt(token);
            setUser(userData);
            return response;
        } catch (err) {
            console.error("❌ Lỗi đăng nhập:", err);
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData) => {
        setIsLoading(true);
        try {
            await registerApi(userData);
        } catch (err) {
            console.error("❌ Lỗi đăng ký:", err);
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = useCallback(() => {
        clearAuthData();
        setUser(null);
        setJwt(null);
        console.log("🚪 Đã đăng xuất");
        window.location.href = "/";
    }, []);

    const setAuthTokenAndFetchUser = useCallback(async (token) => {
        if (!token) return;
        setAuthData(token, null);
        setJwt(token);
        await fetchUserProfile();
    }, [fetchUserProfile]);

    const value = {
        user,
        jwt,
        isLoading,
        error,
        isAuthenticated: !!jwt && !!user,
        login,
        register,
        logout,
        fetchUserProfile,
        setAuthTokenAndFetchUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 👉 Custom Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
