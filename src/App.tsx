import { useApp } from './context/AppContext'
import styled, { ThemeProvider } from 'styled-components'
import { Login } from './pages/Login'
import { OTP } from './pages/OTP'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import { Changelog } from './pages/Changelog'
import { Header } from './components/Header'
import { theme } from './theme'
import { useState, useEffect } from 'react'

const APP_VERSION = '1.1.0'

const Container = styled.div`
  width: 360px;
  min-height: 480px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  position: relative;
`

export const App = () => {
  const { darkMode, userData } = useApp()
  const [currentPage, setCurrentPage] = useState('login')
  const [tempUsername, setTempUsername] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showChangelog, setShowChangelog] = useState(false)
  const [addingAccount, setAddingAccount] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(['loginState', 'tempUsername', 'addingAccount', 'lastVersion'], (result) => {
      if (result.loginState) {
        setCurrentPage(result.loginState)
      }
      if (result.tempUsername) {
        setTempUsername(result.tempUsername)
      }
      if (result.addingAccount) {
        setAddingAccount(true)
      }
      if (userData && result.lastVersion !== APP_VERSION) {
        setShowChangelog(true)
        chrome.storage.local.set({ lastVersion: APP_VERSION })
      }
    })
  }, [userData])

  useEffect(() => {
    if (!userData && !addingAccount) {
      setCurrentPage('login')
      setTempUsername('')
      setShowSettings(false)
      chrome.storage.local.remove(['loginState', 'tempUsername'])
    }
  }, [userData, addingAccount])

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

  const toggleSettings = () => {
    setShowSettings(!showSettings)
    if (!showSettings) {
      setShowChangelog(false)
    }
  }
  
  const toggleChangelog = () => {
    setShowChangelog(!showChangelog)
    if (!showChangelog) {
      setShowSettings(false)
    }
  }
  
  const handleAddAccount = () => {
    setAddingAccount(true)
    setCurrentPage('login')
    chrome.storage.local.set({ 
      addingAccount: true,
      loginState: 'login'
    })
  }
  
  const handleCancelAddAccount = () => {
    setAddingAccount(false);
    setCurrentPage('login');
    setTempUsername('');

    chrome.storage.local.remove([
      'addingAccount', 
      'loginState', 
      'tempUsername',
      'otp_verification_in_progress'
    ]);
  }
  
  return (
    <ThemeProvider theme={darkMode ? theme.dark : theme.light}>
      <Container>
        <Header 
          onSettingsClick={toggleSettings} 
          onAddAccountClick={handleAddAccount}
          onChangelogClick={toggleChangelog}
        />
        
        {(!userData || addingAccount) && currentPage === 'login' && (
          <Login 
            onSubmit={(username) => {
              updateLoginState('otp', username)
            }}
            isAddingAccount={addingAccount}
            onBack={addingAccount ? handleCancelAddAccount : undefined}
          />
        )}
        
        {(!userData || addingAccount) && currentPage === 'otp' && (
          <OTP
            username={tempUsername}
            onBack={() => {
              resetLoginState()
              if (addingAccount && userData) {
                handleCancelAddAccount()
              }
            }}
            isAddingAccount={addingAccount}
            onSuccess={() => {
              if (addingAccount) {
                handleCancelAddAccount()
              }
            }}
          />
        )}
        
        {userData && !addingAccount && !showSettings && !showChangelog && <Dashboard />}
        {userData && !addingAccount && showSettings && <Settings onBack={() => setShowSettings(false)} />}
        {userData && !addingAccount && showChangelog && <Changelog onBack={() => setShowChangelog(false)} />}
      </Container>
    </ThemeProvider>
  )
}