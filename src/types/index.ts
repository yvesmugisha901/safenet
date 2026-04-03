export type UserRole = 'user' | 'resource_manager' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  created_at: string
}

export type ResourceType = 'hospital' | 'fire_station' | 'shelter' | 'police' | 'volunteer'

export interface Resource {
  id: string
  name: string
  type: ResourceType
  address: string
  latitude: number
  longitude: number
  capacity: number
  available: boolean
  phone?: string
  manager_id?: string
  manager_name?: string
  distance_km?: number
}

export type EmergencyType = 'medical' | 'fire' | 'flood' | 'accident' | 'crime' | 'other'
export type EmergencyStatus = 'pending' | 'responding' | 'resolved' | 'cancelled'

export interface Emergency {
  id: string
  title: string
  description?: string
  type: EmergencyType
  status: EmergencyStatus
  latitude: number
  longitude: number
  reported_by?: string
  reported_by_name?: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  emergency_id?: string
  message: string
  channel: 'sms' | 'email' | 'in_app'
  read: boolean
  sent_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
}