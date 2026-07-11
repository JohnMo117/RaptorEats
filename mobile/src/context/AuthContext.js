import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

/**
 * Auth Context — Simulated authentication for frontend prototype.
 *
 * TODO(security): In production, implement proper authentication using
 * OAuth 2.0 or OpenID Connect via a secure backend (BFF pattern).
 * Never store auth tokens in AsyncStorage or localStorage.
 * Session tokens should be managed via HttpOnly, Secure, SameSite cookies
 * set by the backend.
 *
 * TODO(security): Implement password strength validation (min 8 chars).
 * TODO(security): Consider MFA for account security.
 * TODO(security): Use Argon2 or bcrypt for password hashing on the backend.
 */

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = useCallback((email, password) => {
    // Simulated login — validates non-empty fields only
    // TODO(security): In production, send credentials over HTTPS to a secure
    // backend endpoint. Never validate credentials client-side.
    if (email && email.trim().length > 0 && password && password.length > 0) {
      setIsAuthenticated(true);
      // Only store non-sensitive display info
      setUser({ displayName: email.split('@')[0] });
      return { success: true };
    }
    return { success: false, error: 'Por favor ingresa tu correo y contraseña.' };
  }, []);

  const logout = useCallback(() => {
    // Clear all client-side state on logout
    setIsAuthenticated(false);
    setUser(null);
    // TODO(security): In production, also invalidate server-side session
    // and trigger a full page reload/redirect to clear cached state.
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
    }),
    [isAuthenticated, user, login, logout]
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
