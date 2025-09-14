import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdArrowBack } from 'react-icons/md';
import { useI18n } from '../i18n/I18nContext';

const Container = styled.div`
  padding: 16px 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.primary};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  margin-bottom: 16px;
`;

const ChangelogContent = styled.div`
  color: ${props => props.theme.text};
  font-size: 14px;
  line-height: 1.6;
  max-height: 400px;
  overflow-y: auto;
  
  h1 {
    font-size: 22px;
    margin-top: 0;
    margin-bottom: 20px;
    color: ${props => props.theme.text};
    font-weight: 600;
  }
  
  h2 {
    font-size: 18px;
    margin-top: 24px;
    margin-bottom: 12px;
    color: ${props => props.theme.primary};
    border-bottom: 1px solid ${props => props.theme.border};
    padding-bottom: 6px;
  }
  
  h2:first-child {
    margin-top: 0;
  }
  
  h3 {
    font-size: 16px;
    margin-top: 16px;
    margin-bottom: 8px;
    color: ${props => props.theme.textSecondary};
  }
  
  ul {
    margin: 12px 0;
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 6px;
    position: relative;
    list-style-type: none;
    
    &::before {
      content: "•";
      color: ${props => props.theme.primary};
      position: absolute;
      left: -16px;
      font-weight: bold;
    }
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: ${props => props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: ${props => props.theme.primary};
`;

interface ChangelogProps {
  onBack: () => void;
}

const parseChangelog = (markdown: string) => {
  let html = markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>');

  const listItems = html.match(/^- (.*$)/gm);
  if (listItems) {
    listItems.forEach(item => {
      const listContent = item.replace(/^- /, '');
      html = html.replace(item, `<li>${listContent}</li>`);
    });
  }
  
  html = html.replace(/<li>(.+?)<\/li>(\s*<li>)/g, '<li>$1</li>$2');
  html = html.replace(/(^|[^>])\s*<li>/gm, '$1<ul><li>');
  html = html.replace(/<\/li>\s*($|[^<])/gm, '</li></ul>$1');
  
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  html = html.replace(/<\/h2>/g, '</h2><div class="version-content">');
  html = html.replace(/(<h2>|$)/g, '</div>$1');

  html = html.replace(/<div class="version-content"><\/div>/g, '');
  html = html.replace(/^<\/div>/, '');

  html = html.replace('<h1>Changelog</h1>', '<h1>Changelog</h1>');

  return html;
};

export const Changelog = ({ onBack }: ChangelogProps) => {
  const [changelog, setChangelog] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await fetch(chrome.runtime.getURL('CHANGELOG.md'));
        if (!response.ok) {
          throw new Error('Failed to load changelog');
        }
        const text = await response.text();
        const parsedHtml = parseChangelog(text);
        setChangelog(parsedHtml);
      } catch (err) {
        console.error('Error loading changelog:', err);
        setError(error || t('changelog.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchChangelog();
  }, []);

  return (
    <Container>
      <BackButton onClick={onBack}>
        <MdArrowBack size={20} />
        {t('common.back')} {t('dashboard.title')}
      </BackButton>

      {loading && <LoadingMessage>{t('changelog.loading')}</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!loading && !error && (
        <ChangelogContent dangerouslySetInnerHTML={{ __html: changelog }} />
      )}
    </Container>
  );
};