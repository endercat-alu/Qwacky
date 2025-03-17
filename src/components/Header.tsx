import styled from 'styled-components'
import { MdLightMode, MdDarkMode, MdLogout, MdSettings, MdDevices, MdMenu, MdAccountCircle, MdPersonAdd, MdUpdate } from 'react-icons/md'
import { FaGithub } from 'react-icons/fa'
import { useApp } from '../context/AppContext'
import { useState, useRef, useEffect } from 'react'

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
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
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
  
  &.settings {
    color: ${props => props.theme.primary};
  }
  
  &.menu {
    color: ${props => props.theme.primary};
  }
`

const ThemeDropdown = styled.div`
  position: relative;
  display: inline-block;
`

const MenuDropdown = styled.div`
  position: relative;
  display: inline-block;
`

const DropdownContent = styled.div<{ isOpen: boolean }>`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  right: 0;
  background-color: ${props => props.theme.background};
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
`

const DropdownItem = styled.div<{ active?: boolean; current?: boolean }>`
  color: ${props => {
    if (props.current) return props.theme.primary;
    return props.active ? props.theme.primary : props.theme.text;
  }};
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.hover};
  }
  
  svg {
    color: ${props => {
      if (props.current) return props.theme.primary;
      return props.active ? props.theme.primary : props.theme.text;
    }};
  }
`

const DropdownDivider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.border};
  margin: 4px 0;
`

const AccountItem = styled(DropdownItem)`
  padding: 8px 16px;
  font-size: 14px;
  
  &.current {
    color: ${props => props.theme.primary};
    font-weight: 500;
    
    svg {
      color: ${props => props.theme.primary};
    }
  }
  
  .username {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

interface HeaderProps {
  onSettingsClick?: () => void;
  onAddAccountClick?: () => void;
  onChangelogClick?: () => void;
}

export const Header = ({ onSettingsClick, onAddAccountClick, onChangelogClick }: HeaderProps) => {
  const { darkMode, themeMode, setThemeMode, userData, logout, accounts, currentAccount, switchAccount } = useApp()
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false)
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false)
  const themeDropdownRef = useRef<HTMLDivElement>(null)
  const menuDropdownRef = useRef<HTMLDivElement>(null)
  
  const openGitHub = () => {
    window.open('https://github.com/Lanshuns/Qwacky', '_blank')
  }
  
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout()
      setMenuDropdownOpen(false)
    }
  }
  
  const handleSwitchAccount = (username: string) => {
    switchAccount(username)
    setMenuDropdownOpen(false)
  }
  
  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick()
      setMenuDropdownOpen(false)
    }
  }
  
  const handleAddAccountClick = () => {
    if (onAddAccountClick) {
      onAddAccountClick()
      setMenuDropdownOpen(false)
    }
  }

  const handleChangelogClick = () => {
    if (onChangelogClick) {
      onChangelogClick();
      setMenuDropdownOpen(false);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false)
      }
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target as Node)) {
        setMenuDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <HeaderContainer>
      <TitleSection onClick={openGitHub}>
        <Logo src="/icons/qwacky.png" alt="Qwacky" />
        <Title>Qwacky</Title>
      </TitleSection>
      <IconsSection>
        <ThemeDropdown ref={themeDropdownRef}>
          <IconButton onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}>
            {darkMode ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
          </IconButton>
          <DropdownContent isOpen={themeDropdownOpen}>
            <DropdownItem 
              active={themeMode === 'light'} 
              onClick={() => { setThemeMode('light'); setThemeDropdownOpen(false); }}
            >
              <MdLightMode size={20} /> Light
            </DropdownItem>
            <DropdownItem 
              active={themeMode === 'dark'} 
              onClick={() => { setThemeMode('dark'); setThemeDropdownOpen(false); }}
            >
              <MdDarkMode size={20} /> Dark
            </DropdownItem>
            <DropdownItem 
              active={themeMode === 'system'} 
              onClick={() => { setThemeMode('system'); setThemeDropdownOpen(false); }}
            >
              <MdDevices size={20} /> System
            </DropdownItem>
          </DropdownContent>
        </ThemeDropdown>
        <IconButton className="github" onClick={openGitHub}>
          <FaGithub size={24} />
        </IconButton>
        {userData && (
          <MenuDropdown ref={menuDropdownRef}>
            <IconButton className="menu" onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}>
              <MdMenu size={24} />
            </IconButton>
            <DropdownContent isOpen={menuDropdownOpen}>
              {currentAccount && (
                <DropdownItem current={true}>
                  <MdAccountCircle size={20} />
                  <span className="username">{currentAccount}</span>
                </DropdownItem>
              )}
              
              {accounts.length > 1 && (
                accounts
                  .filter(account => account.username !== currentAccount)
                  .map(account => (
                    <AccountItem 
                      key={account.username}
                      onClick={() => handleSwitchAccount(account.username)}
                    >
                      <MdAccountCircle size={16} />
                      <span className="username">{account.username}</span>
                    </AccountItem>
                  ))
              )}
              
              <DropdownItem onClick={handleAddAccountClick}>
                <MdPersonAdd size={20} />
                Add Account
              </DropdownItem>
              
              <DropdownDivider />
              
              <DropdownItem onClick={handleChangelogClick}>
                <MdUpdate size={20} />
                Changelog
              </DropdownItem>
              
              <DropdownItem onClick={handleSettingsClick}>
                <MdSettings size={20} />
                Settings
              </DropdownItem>
              
              <DropdownItem onClick={handleLogout}>
                <MdLogout size={20} />
                Logout
              </DropdownItem>
            </DropdownContent>
          </MenuDropdown>
        )}
      </IconsSection>
    </HeaderContainer>
  )
}