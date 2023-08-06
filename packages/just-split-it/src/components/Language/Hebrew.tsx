import React from 'react';
import Language from '@/components/Language/Language';

import { LanguageMode } from '@/components/Language/index';

interface HebrewProps {
  children: React.ReactNode;
}
const Hebrew = (props: HebrewProps) => {
  return <Language language={LanguageMode.Hebrew}>{props.children}</Language>;
};

export default Hebrew;
