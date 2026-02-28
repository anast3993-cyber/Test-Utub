"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface User {
  id: string
  email: string
  full_name?: string
}

interface AuthState {
  user: User | null
  credits: number
  loading: boolean
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string; requiresEmailConfirmation?: boolean }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  refreshCredits: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    credits: 0,
    loading: true
  })

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('supabase_token')
      if (!token) {
        setState(s => ({ ...s, loading: false }))
        return
      }

      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setState({
          user: data.user,
          credits: data.credits,
          loading: false
        })
      } else {
        localStorage.removeItem('supabase_token')
        setState(s => ({ ...s, loading: false }))
      }
    } catch {
      setState(s => ({ ...s, loading: false }))
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      return { error: data.error }
    }

    if (data.session) {
      localStorage.setItem('supabase_token', data.session.access_token)
      setState({
        user: data.user,
        credits: data.credits ?? 5, // Use credits from response or default to 5
        loading: false
      })
    }

    return { requiresEmailConfirmation: data.requiresEmailConfirmation }
  }

  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      return { error: data.error }
    }

    localStorage.setItem('supabase_token', data.session.access_token)
    
    // Fetch user credits
    const meRes = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${data.session.access_token}` }
    })
    const meData = await meRes.json()

    setState({
      user: meData.user,
      credits: meData.credits,
      loading: false
    })

    return {}
  }

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('supabase_token')
    setState({ user: null, credits: 0, loading: false })
  }

  const refreshCredits = async () => {
    const token = localStorage.getItem('supabase_token')
    if (!token) return

    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (res.ok) {
      const data = await res.json()
      setState(s => ({ ...s, credits: data.credits }))
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut, refreshCredits }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
