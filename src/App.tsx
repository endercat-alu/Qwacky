import { useApp } from './context/AppContext'
import styled, { ThemeProvider } from 'styled-components'
import { Login } from './pages/Login'
import { OTP } from './pages/OTP'
import { Dashboard } from './pages/Dashboard'
import { Header } from './components/Header'
import { theme } from './theme'
import { useState } from 'react'

const Container = styled.div`
  width: 360px;
  min-height: 480px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
`

export const App = () => {
  const { darkMode, userData } = useApp()
  const [currentPage, setCurrentPage] = useState('login')
  const [tempUsername, setTempUsername] = useState('')
  
  return (
    <ThemeProvider theme={darkMode ? theme.dark : theme.light}>
      <Container>
        <Header />
        
        {!userData && currentPage === 'login' && (
          <Login 
            onSubmit={(username) => {
              setTempUsername(username)
              setCurrentPage('otp')
            }}
          />
        )}
        
        {!userData && currentPage === 'otp' && (
          <OTP
            username={tempUsername}
            onBack={() => setCurrentPage('login')}
          />
        )}
        
        {userData && <Dashboard />}
      </Container>
    </ThemeProvider>
  )
} 