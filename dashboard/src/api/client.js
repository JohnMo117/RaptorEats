// A lightweight fetch wrapper for the dashboard to communicate with the server
export const apiClient = async (endpoint, { method = 'GET', body, ...customConfig } = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    method,
    headers,
    ...customConfig,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`/api${endpoint}`, config);
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw new Error(data.error || 'Algo salió mal');
  }
};
