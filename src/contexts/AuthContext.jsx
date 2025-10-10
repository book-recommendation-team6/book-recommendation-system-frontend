// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'tekbook_user';

// Mock user database (in real app, this would be backend)
const MOCK_USERS = [
  {
    id: 1,
    email: 'user@example.com',
    password: 'password123',
    name: 'Sĩ Cường',
    phone: '0910225538',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'
  }
];

function AuthProvider ({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check credentials
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    // Remove password before storing
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);

    return userWithoutPassword;
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email already exists
    const emailExists = MOCK_USERS.some(u => u.email === userData.email);
    if (emailExists) {
      throw new Error('Email đã được sử dụng');
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      email: userData.email,
      name: userData.username,
      phone: userData.phone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=random`
    };

    // Add to mock database
    MOCK_USERS.push({ ...newUser, password: userData.password });

    // Store in localStorage (without password)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);

    return newUser;
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  // Update user profile
  const updateProfile = useCallback((updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, [user]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;