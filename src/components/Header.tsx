import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { MdLightMode, MdDarkMode, MdLogout, MdSettings, MdDevices, MdMenu, MdAccountCircle, MdPersonAdd, MdUpdate, MdSwapHoriz, MdKeyboardArrowDown } from 'react-icons/md'
import { FaGithub } from 'react-icons/fa'
import { useApp, ThemeMode } from '../context/AppContext'
import { ConfirmDialog } from './ConfirmDialog'
import { useI18n } from '../i18n/I18nContext'

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
  color: ${props => props.theme.primary};
  cursor: pointer;
  padding: 4px;
  
  &.logout {
    color: ${props => props.theme.error};
  }
`

const BaseDropdown = styled.div`
  position: relative;
  display: inline-block;
`

const ThemeDropdown = styled(BaseDropdown)``
const MenuDropdown = styled(BaseDropdown)``

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

const SubDropdown = styled.div`
  padding-left: 16px;
  background-color: ${props => props.theme.surface};
  border-left: 2px solid ${props => props.theme.border};
  margin: 4px 0;
  display: none;
`

const AccountsMenuWrapper = styled.div<{ isOpen?: boolean }>`
  ${SubDropdown} {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`

const DropdownItem = styled.div<{ active?: boolean; current?: boolean; logout?: boolean }>`
  color: ${props => {
    if (props.logout) return props.theme.error;
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
      if (props.logout) return props.theme.error;
      return props.theme.primary;
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [accountsListOpen, setAccountsListOpen] = useState(false)
  const themeDropdownRef = useRef<HTMLDivElement>(null)
  const menuDropdownRef = useRef<HTMLDivElement>(null)
  const { t } = useI18n()
  
  const openGitHub = () => window.open('https://github.com/endercat-alu/Qwacky', '_blank')
  const openStore = () => window.open('https://chromewebstore.google.com/detail/qwacky/kieehbhdbincplacegpjdkoglfakboeo', '_blank')
  
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
    setMenuDropdownOpen(false)
  }
  
  const handleLogoutConfirm = async () => {
    await logout()
    setShowLogoutConfirm(false)
  }
  
  const handleSwitchAccount = (username: string) => {
    switchAccount(username)
    setMenuDropdownOpen(false)
  }
  
  const handleMenuItemClick = (handler?: () => void) => {
    if (handler) {
      handler()
      setMenuDropdownOpen(false)
    }
  }
  
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
    <>
      <HeaderContainer>
        <TitleSection onClick={openStore}>
          <Logo src="/assets/icons/qwacky.png" alt="Qwacky" />
          <Title>Qwacky</Title>
        </TitleSection>
        <IconsSection>
          <ThemeDropdown ref={themeDropdownRef}>
            <IconButton onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}>
              {darkMode ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
            </IconButton>
            <DropdownContent isOpen={themeDropdownOpen}>
              {[
                { mode: 'light' as const, icon: MdLightMode, label: t('header.theme.light') },
                { mode: 'dark' as const, icon: MdDarkMode, label: t('header.theme.dark') },
                { mode: 'system' as const, icon: MdDevices, label: t('header.theme.system') }
              ].map(({ mode, icon: Icon, label }) => (
                <DropdownItem
                  key={mode}
                  active={themeMode === mode}
                  onClick={() => {
                    setThemeMode(mode as ThemeMode)
                    setThemeDropdownOpen(false);
                  }}
                >
                  <Icon size={20} /> {label}
                </DropdownItem>
              ))}
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
                <DropdownItem current={true}>
                  <MdAccountCircle size={20} />
                  <span className="username">{currentAccount}</span>
                </DropdownItem>
                
                <DropdownDivider />
                {accounts.length > 1 && (
                  <AccountsMenuWrapper isOpen={accountsListOpen}>
                    <DropdownItem onClick={() => setAccountsListOpen(!accountsListOpen)}>
                      <MdSwapHoriz size={20} />
                      {t('header.menu.switchAccount')}
                      <MdKeyboardArrowDown
                        size={20}
                        style={{
                          marginLeft: 'auto',
                          transform: accountsListOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s'
                        }}
                      />
                    </DropdownItem>
                    <SubDropdown>
                      {accounts
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
                      }
                    </SubDropdown>
                  </AccountsMenuWrapper>
                )}
                {accountsListOpen && <DropdownDivider />}
                <DropdownItem onClick={() => handleMenuItemClick(onAddAccountClick)}>
                  <MdPersonAdd size={20} />
                  {t('header.menu.addAccount')}
                </DropdownItem>
                <DropdownDivider />
                
                <DropdownItem onClick={() => handleMenuItemClick(onSettingsClick)}>
                  <MdSettings size={20} />
                  {t('header.menu.settings')}
                </DropdownItem>
                
                <DropdownItem onClick={() => handleMenuItemClick(onChangelogClick)}>
                  <MdUpdate size={20} />
                  {t('header.menu.changelog')}
                </DropdownItem>
                
                <DropdownItem onClick={handleLogoutClick} logout>
                  <MdLogout size={20} />
                  {t('header.menu.logout')}
                </DropdownItem>
              </DropdownContent>
            </MenuDropdown>
          )}
        </IconsSection>
      </HeaderContainer>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title={t('header.menu.logoutConfirm.title')}
        message={t('header.menu.logoutConfirm.message')}
        confirmLabel={t('header.menu.logoutConfirm.confirm')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  )
}