import React from 'react';
import styled from 'styled-components';
import { useI18n } from '../i18n/I18nContext';

const SwitcherContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px;
  background: ${props => props.theme.surface};
  border-radius: 8px;
  margin: 16px 0;
`;

const LanguageButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  background: ${props => props.active ? props.theme.primary : props.theme.surface};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const LanguageInfo = styled.div`
  margin-left: 16px;
  color: ${props => props.theme.text};
`;

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useI18n();
  
  return (
    <SwitcherContainer>
      <LanguageButton 
        active={language === 'en'} 
        onClick={() => setLanguage('en')}
      >
        English
      </LanguageButton>
      <LanguageButton 
        active={language === 'zh'} 
        onClick={() => setLanguage('zh')}
      >
        中文
      </LanguageButton>
      <LanguageInfo>
        {t('common.appName')}: {language}
      </LanguageInfo>
    </SwitcherContainer>
  );
};