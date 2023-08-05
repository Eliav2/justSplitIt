import { atom, useRecoilState } from 'recoil';

import type { AtomEffectParams } from '../types';

export enum LanguageMode {
  English = 'english',
  Hebrew = 'hebrew',
}

const languageState = atom({
  key: 'theme-language-mode',
  default: 'hebraw' as LanguageMode,
  effects: [synchronizeLanguageWithLocalStorage],
});

function synchronizeLanguageWithLocalStorage({ setSelf, onSet }: AtomEffectParams) {
  const storedTheme = localStorage.getItem('language-mode');
  storedTheme && setSelf(storedTheme);
  onSet((value: LanguageMode) => localStorage.setItem('language-mode', value));
}

function useLanguage() {
  const [languageMode, setThemeMode] = useRecoilState(languageState);

  function setLanguage(language: LanguageMode) {
    setThemeMode((language: LanguageMode) => language);
  }
  const actions = { setLanguage };

  return [languageMode, actions] as const;
}

export default useLanguage;
