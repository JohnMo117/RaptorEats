import * as SecureStore from 'expo-secure-store';

export const SOCKET_URL = 'http://192.168.0.72:3000';
const API_BASE_URL = `${SOCKET_URL}/api`;
const TOKEN_KEY = 'auth_token';

/**
 * A fetch wrapper that automatically attaches the JWT Bearer token
 * to every request.
 */
export async function apiClient(endpoint, { method = 'GET', body, ...customConfig } = {}) {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'API request failed');
  }

  // Not all responses have JSON bodies (like 204 No Content), but our API mostly returns JSON
  return response.json().catch(() => ({}));
}

export async function setToken(token) {
  if (token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function getToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}
