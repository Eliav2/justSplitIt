import { atom, useRecoilState } from 'recoil';

import { ThemeMode } from '@/theme/types';

import type { AtomEffectParams } from '../types';
import type { Actions } from './types';

const themeModeState = atom({
  key: 'theme-mode-state',
  default: 'dark' as ThemeMode,
  effects: [synchronizeWithLocalStorage],
});

function synchronizeWithLocalStorage({ setSelf, onSet }: AtomEffectParams) {
  const storedTheme = localStorage.getItem('theme-mode');
  storedTheme && setSelf(storedTheme);
  onSet((value: ThemeMode) => localStorage.setItem('theme-mode', value));
}

function useAppTheme(): [ThemeMode, Actions] {
  const [themeMode, setThemeMode] = useRecoilState(themeModeState);

  function toggle() {
    setThemeMode((mode: ThemeMode) => (mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK));
  }

  return [themeMode, { toggle }];
}

export default useAppTheme;
