import React from 'react';
import Language from '@/components/Language/Language';
import { LanguageMode } from '@/store/theme/useThemeLanguage';

interface HebrewProps {
  children: React.ReactNode;
}
const Hebrew = (props: HebrewProps) => {
  return <Language language={LanguageMode.Hebrew}>{props.children}</Language>;
};

export default Hebrew;
