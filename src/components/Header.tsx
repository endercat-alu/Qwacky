import styled from 'styled-components'
import { MdLightMode, MdDarkMode, MdLogout } from 'react-icons/md'
import { useApp } from '../context/AppContext'

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.border};
`

const Title = styled.h1`
  font-size: 24px;
  color: ${props => props.theme.primary};
  margin: 0;
`

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 4px;
  
  &.logout {
    color: ${props => props.theme.primary};
  }
`

export const Header = () => {
  const { darkMode, toggleDarkMode, userData, logout } = useApp()

  return (
    <HeaderContainer>
      <Title>Qwacky</Title>
      <div>
        <IconButton onClick={toggleDarkMode}>
          {darkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </IconButton>
        {userData && (
          <IconButton className="logout" onClick={logout}>
            <MdLogout size={24} />
          </IconButton>
        )}
      </div>
    </HeaderContainer>
  )
} 