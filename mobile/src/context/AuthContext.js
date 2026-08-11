import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { apiClient, setToken as setApiToken, getToken } from '../api/client';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token on app start
  useEffect(() => {
    async function loadStoredToken() {
      try {
        const token = await getToken();
        if (token) {
          setIsAuthenticated(true);
          const storedUser = await SecureStore.getItemAsync('auth_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (e) {
        console.error("Failed to load token", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredToken();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, error: 'Por favor ingresa tu correo y contraseña.' };
      }
      
      const response = await apiClient('/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      
      await setApiToken(response.token);
      await SecureStore.setItemAsync('auth_user', JSON.stringify(response.user));
      setIsAuthenticated(true);
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Error al iniciar sesión' };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      if (!name || !email || !password) {
        return { success: false, error: 'Por favor completa todos los campos.' };
      }
      
      const response = await apiClient('/auth/register', {
        method: 'POST',
        body: { name, email, password, role: 'CUSTOMER' }
      });
      
      // Auto-login after registration is not required, but nice. We will just return success.
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Error al registrarse' };
    }
  }, []);

  const logout = useCallback(async () => {
    await setApiToken(null);
    await SecureStore.deleteItemAsync('auth_user');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      isLoading,
      login,
      register,
      logout,
    }),
    [isAuthenticated, user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
