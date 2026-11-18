import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { ApiService } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => StorageService.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Signed in by default for smooth UX

  useEffect(() => {
    const savedUser = StorageService.getUser();
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials) => {
    const res = await ApiService.login(credentials);
    if (res.success) {
      setUser(res.user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (userData) => {
    const res = await ApiService.register(userData);
    if (res.success) {
      setUser(res.user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('spendaura_access_token');
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    StorageService.saveUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
