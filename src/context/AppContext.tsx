import React, { createContext, useContext, useState, useEffect } from 'react'
import { DuckService } from '../services/DuckService'
import { UserData } from '../types'

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined)
const duckService = new DuckService()

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    duckService.getUserData().then(setUserData)
  }, [])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const logout = async () => {
    await duckService.logout()
    setUserData(null)
  }

  return (
    <AppContext.Provider value={{ darkMode, toggleDarkMode, userData, setUserData, logout }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 