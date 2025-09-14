import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { UserData } from '../types';
import { useI18n } from '../i18n/I18nContext';

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h2 {
    font-size: 18px;
    margin: 0;
  }
`;

const InfoItem = styled.div`
  margin-bottom: 12px;

  label {
    display: block;
    font-size: 16px;
    margin-bottom: 4px;
    color: ${(props) => props.theme.text}80;

    &.highlight {
      color: ${(props) => props.theme.primary};
    }
  }

  div {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: color 0.2s;
    font-size: 14px;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const InfoValue = styled.span<{ hidden?: boolean }>`
  flex: 1;
  display: ${(props) => (props.hidden ? "none" : "block")};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  padding: 4px;

  svg {
    width: 24px;
    height: 24px;
  }
`;

interface UserInfoSectionProps {
  userData: UserData;
  addressesCount: number;
  copyToClipboard: (text: string, event?: MouseEvent) => void;
}

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  userData,
  addressesCount,
  copyToClipboard
}) => {
  const [hideUserInfo, setHideUserInfo] = useState(false);
  const { t } = useI18n();

  const maskText = (text: string) => "*".repeat(text.length);

  const toggleHideUserInfo = useCallback(() => {
    setHideUserInfo(prev => !prev);
  }, []);

  return (
    <Section>
      <SectionHeader>
        <h2 id="user-info-heading">{t('dashboard.userInfo.title')}</h2>
        <IconButton 
          onClick={toggleHideUserInfo}
          aria-label={hideUserInfo ? t('dashboard.addresses.show') : t('dashboard.addresses.hide')}
          aria-expanded={!hideUserInfo}
          aria-controls="user-info-content"
        >
          {hideUserInfo ? <MdVisibility /> : <MdVisibilityOff />}
        </IconButton>
      </SectionHeader>
      <div id="user-info-content" aria-labelledby="user-info-heading">
        <InfoItem>
          <label className="highlight" id="username-label">{t('dashboard.userInfo.username')}</label>
          <div 
            onClick={(e) => copyToClipboard(`${userData.user.username}@duck.com`, e.nativeEvent)}
            role="button"
            aria-labelledby="username-label"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyToClipboard(`${userData.user.username}@duck.com`, e.nativeEvent as unknown as MouseEvent);
              }
            }}
          >
            <InfoValue>{hideUserInfo ? maskText(`${userData.user.username}@duck.com`) : `${userData.user.username}@duck.com`}</InfoValue>
          </div>
        </InfoItem>
        <InfoItem>
          <label className="highlight" id="email-label">{t('dashboard.userInfo.email')}</label>
          <div 
            onClick={(e) => copyToClipboard(userData.user.email, e.nativeEvent)}
            role="button"
            aria-labelledby="email-label"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyToClipboard(userData.user.email, e.nativeEvent as unknown as MouseEvent);
              }
            }}
          >
            <InfoValue>{hideUserInfo ? maskText(userData.user.email) : userData.user.email}</InfoValue>
          </div>
        </InfoItem>
        <InfoItem>
          <label className="highlight" id="count-label">{t('dashboard.userInfo.totalGenerated')}</label>
          <div aria-labelledby="count-label">
            <span>{addressesCount}</span>
          </div>
        </InfoItem>
        {userData.invites.length > 0 && (
          <InfoItem>
            <label id="invites-label">{t('dashboard.userInfo.invites')}</label>
            <div aria-labelledby="invites-label">
              <span>{userData.invites.length}</span>
            </div>
          </InfoItem>
        )}
      </div>
    </Section>
  );
}; 