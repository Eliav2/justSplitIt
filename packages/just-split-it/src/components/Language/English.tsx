import React from 'react';
import Language from '@/components/Language/Language';
import { LanguageMode } from '@/store/theme/useThemeLanguage';

interface EnglishProps {
  children: React.ReactNode;
}
const English = (props: EnglishProps) => {
  return <Language language={LanguageMode.English}>{props.children}</Language>;
};

export default English;
