import { atom, useRecoilState } from 'recoil';

import type { AtomEffectParams } from '../types';
import { LanguageMode } from '@/components/Language';

const languageState = atom({
  key: 'theme-language-mode',
  default: LanguageMode.Hebrew,
  effects: [synchronizeLanguageWithLocalStorage],
});

function synchronizeLanguageWithLocalStorage({ setSelf, onSet }: AtomEffectParams) {
  let storedTheme = localStorage.getItem('language-mode') as LanguageMode | null;
  if (storedTheme && !Object.values(LanguageMode).includes(storedTheme)) {
    localStorage.setItem('language-mode', LanguageMode.Hebrew);
    storedTheme = LanguageMode.Hebrew;
  }
  storedTheme && setSelf(storedTheme);
  onSet((value: LanguageMode) => localStorage.setItem('language-mode', value));
}

function useLanguage() {
  const [languageMode, setThemeMode] = useRecoilState(languageState);

  function setLanguage(language: LanguageMode) {
    setThemeMode(language);
  }
  const actions = { setLanguage };

  return [languageMode, actions] as const;
}

export const useShouldUseRTL = () => {
  const [appLanguage] = useLanguage();
  return appLanguage === LanguageMode.Hebrew;
};

export const useLanguageSentence = (sentences: Record<LanguageMode, string>) => {
  const [language] = useLanguage();
  return sentences[language];
};

export default useLanguage;
