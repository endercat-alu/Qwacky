import { useApp } from './context/AppContext'
import styled, { ThemeProvider } from 'styled-components'
import { Login } from './pages/Login'
import { OTP } from './pages/OTP'
import { Dashboard } from './pages/Dashboard'
import { Header } from './components/Header'
import { theme } from './theme'
import { useState, useEffect } from 'react'

const Container = styled.div`
  width: 360px;
  min-height: 480px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  position: relative;
`

const Version = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 12px;
  color: ${props => props.theme.primary};
  opacity: 0.8;
`

export const App = () => {
  const { darkMode, userData } = useApp()
  const [currentPage, setCurrentPage] = useState('login')
  const [tempUsername, setTempUsername] = useState('')
  
  // Load persisted state on mount
  useEffect(() => {
    chrome.storage.local.get(['loginState', 'tempUsername'], (result) => {
      if (result.loginState) {
        setCurrentPage(result.loginState)
      }
      if (result.tempUsername) {
        setTempUsername(result.tempUsername)
      }
    })
  }, [])

  // Reset login state when userData changes to null (logout)
  useEffect(() => {
    if (!userData) {
      setCurrentPage('login')
      setTempUsername('')
      chrome.storage.local.remove(['loginState', 'tempUsername'])
    }
  }, [userData])

  // Save state changes to storage
  const updateLoginState = (page: string, username?: string) => {
    setCurrentPage(page)
    chrome.storage.local.set({ loginState: page })
    
    if (username) {
      setTempUsername(username)
      chrome.storage.local.set({ tempUsername: username })
    }
  }

  const resetLoginState = () => {
    setCurrentPage('login')
    setTempUsername('')
    chrome.storage.local.remove(['loginState', 'tempUsername'])
  }
  
  return (
    <ThemeProvider theme={darkMode ? theme.dark : theme.light}>
      <Container>
        <Header />
        
        {!userData && currentPage === 'login' && (
          <Login 
            onSubmit={(username) => {
              updateLoginState('otp', username)
            }}
          />
        )}
        
        {!userData && currentPage === 'otp' && (
          <OTP
            username={tempUsername}
            onBack={() => resetLoginState()}
          />
        )}
        
        {userData && <Dashboard />}
        <Version>v1.0.1</Version>
      </Container>
    </ThemeProvider>
  )
}