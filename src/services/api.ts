const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const getToken = () => localStorage.getItem('safenet_token')

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return response.json()
}

export const authAPI = {
  register: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data: any) => request('/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),
  getAllUsers: () => request('/auth/users'),
  updateUserRole: (id: string, role: string) => request(`/auth/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
}

export const emergencyAPI = {
  report: (data: any) => request('/emergencies', { method: 'POST', body: JSON.stringify(data) }),
  list: () => request('/emergencies'),
  getById: (id: string) => request(`/emergencies/${id}`),
  updateStatus: (id: string, status: string) => request(`/emergencies/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getStats: () => request('/emergencies/stats'),
}

export const resourceAPI = {
  list: () => request('/resources'),
  mine: () => request('/resources/mine'),
  getById: (id: string) => request(`/resources/${id}`),
  nearby: (lat: number, lng: number, radius = 10) => request(`/resources/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  create: (data: any) => request('/resources', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request(`/resources/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => request(`/resources/${id}`, { method: 'DELETE' }),
}

export const notificationAPI = {
  list: () => request('/notifications'),
  unreadCount: () => request('/notifications/unread'),
  markRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),
}