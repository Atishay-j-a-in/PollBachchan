import { createContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/authApi'
import {
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
} from '../utils/authStorage'

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth())

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'pollbachchan_auth') {
        const updatedAuth = getStoredAuth()
        setAuth(updatedAuth)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = (payload) => {
    setAuth(payload)
    setStoredAuth(payload)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // Ignore logout errors and clear local state.
    }
    clearStoredAuth()
    setAuth(null)
  }

  const value = useMemo(
    () => ({
      user: auth?.user ?? null,
      accessToken: auth?.accessToken ?? null,
      isAuthenticated: Boolean(auth?.accessToken),
      login,
      logout,
      setAuth,
    }),
    [auth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
