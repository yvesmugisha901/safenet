import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthState } from '../types'
import { authAPI } from '../services/api'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('safenet_token'),
    isLoading: true,
  })

  const refreshUser = async () => {
    try {
      const user = await authAPI.getMe() as User
      setState(s => ({ ...s, user }))
    } catch {
      // silent fail
    }
  }

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('safenet_token')
      if (token) {
        try {
          const user = await authAPI.getMe() as User
          setState({ user, token, isLoading: false })
        } catch {
          localStorage.removeItem('safenet_token')
          setState({ user: null, token: null, isLoading: false })
        }
      } else {
        setState(s => ({ ...s, isLoading: false }))
      }
    }
    init()
  }, [])

  const login = async (email: string, password: string) => {
    const res: any = await authAPI.login({ email, password })
    localStorage.setItem('safenet_token', res.token)
    setState({ user: res.user, token: res.token, isLoading: false })
  }

  const register = async (data: any) => {
    const res: any = await authAPI.register(data)
    localStorage.setItem('safenet_token', res.token)
    setState({ user: res.user, token: res.token, isLoading: false })
  }

  const logout = () => {
    localStorage.removeItem('safenet_token')
    setState({ user: null, token: null, isLoading: false })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}