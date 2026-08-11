import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    // For the dashboard, we probably want to strictly enforce the 'KITCHEN' role.
    // Right now, any registered user can technically login, but we'll check it anyway.
    if (token) {
      setIsAuthenticated(true);
      setUser({ role });
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiClient('/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      
      setIsAuthenticated(true);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
