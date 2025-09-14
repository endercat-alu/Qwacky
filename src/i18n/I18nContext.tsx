import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enTranslations from './locales/en.json';
import zhTranslations from './locales/zh.json';

// 定义语言类型
export type Language = 'en' | 'zh';

// 定义翻译键类型
type TranslationKeys = typeof enTranslations;

// 定义上下文类型
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// 创建上下文
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// 翻译文件映射
const translations: Record<Language, TranslationKeys> = {
  en: enTranslations,
  zh: zhTranslations
};

// 获取嵌套对象的值
const getNestedValue = (obj: any, path: string): string | undefined => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// 格式化翻译字符串
const formatString = (str: string, params?: Record<string, string | number>): string => {
  if (!params) return str;
  
  let formatted = str;
  Object.keys(params).forEach(key => {
    formatted = formatted.replace(new RegExp(`{{${key}}}`, 'g'), String(params[key]));
  });
  
  return formatted;
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // 从localStorage获取保存的语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      return savedLanguage as Language;
    }
    
    // 默认使用浏览器语言
    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith('zh')) {
      return 'zh';
    }
    return 'en';
  });

  // 保存语言设置到localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // 翻译函数
  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = getNestedValue(translations[language], key);
    if (translation === undefined) {
      // 如果在当前语言中找不到翻译，回退到英文
      const fallbackTranslation = getNestedValue(translations.en, key);
      return fallbackTranslation || key;
    }
    
    return formatString(translation, params);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};