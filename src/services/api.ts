// services/api.ts – Central Axios-like fetch wrapper

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('safenet_token');

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Request failed');
  }
  return response.json();
}

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  register: (data: any) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
};

// ── Emergencies ───────────────────────────────────────────────
export const emergencyAPI = {
  report: (data: any) =>
    request('/emergencies', { method: 'POST', body: JSON.stringify(data) }),
  list: () => request('/emergencies'),
  updateStatus: (id: string, status: string) =>
    request(`/emergencies/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  getStats: () => request('/emergencies/stats'),
};

// ── Resources ─────────────────────────────────────────────────
export const resourceAPI = {
  list: () => request('/resources'),
  create: (data: any) =>
    request('/resources', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request(`/resources/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ── Notifications ─────────────────────────────────────────────
export const notificationAPI = {
  list: () => request('/notifications'),
  markRead: (id: string) =>
    request(`/notifications/${id}/read`, { method: 'PATCH' }),
};
