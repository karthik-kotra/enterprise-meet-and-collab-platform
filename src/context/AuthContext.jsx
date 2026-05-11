import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('meetflow_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (userData) => {
    const u = { id: 1, name: userData.name || 'User', email: userData.email, avatar: null }
    localStorage.setItem('meetflow_user', JSON.stringify(u))
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('meetflow_user')
    setUser(null)
  }

  const updateProfile = (data) => {
    const updated = { ...user, ...data }
    localStorage.setItem('meetflow_user', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
