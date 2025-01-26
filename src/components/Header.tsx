import styled from 'styled-components'
import { MdLightMode, MdDarkMode, MdLogout } from 'react-icons/md'
import { FaGithub } from 'react-icons/fa'
import { useApp } from '../context/AppContext'

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.border};
`

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Title = styled.h1`
  font-size: 24px;
  color: ${props => props.theme.primary};
  margin: 0;
`

const Logo = styled.img`
  width: 32px;
  height: 32px;
`

const IconsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

  &.github {
    color: ${props => props.theme.primary};
  }
`

export const Header = () => {
  const { darkMode, toggleDarkMode, userData, logout } = useApp()

  const openGitHub = () => {
    window.open('https://github.com/Lanshuns/Qwacky', '_blank')
  }

  return (
    <HeaderContainer>
      <TitleSection>
        <Logo src="/icons/qwacky.png" alt="Qwacky" />
        <Title>Qwacky</Title>
      </TitleSection>
      <IconsSection>
        <IconButton className="github" onClick={openGitHub}>
          <FaGithub size={24} />
        </IconButton>
        <IconButton onClick={toggleDarkMode}>
          {darkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </IconButton>
        {userData && (
          <IconButton className="logout" onClick={logout}>
            <MdLogout size={24} />
          </IconButton>
        )}
      </IconsSection>
    </HeaderContainer>
  )
} 