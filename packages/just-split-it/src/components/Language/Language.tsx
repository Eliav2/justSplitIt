import React from 'react';
import useLanguage from '@/store/theme/useThemeLanguage';

interface LanguageProps {
  language: string;
  children: React.ReactNode;
}
const Language = (props: LanguageProps) => {
  const [language] = useLanguage();

  if (language == props.language) {
    return <>{props.children}</>;
  }
  return null;
};

export default Language;
