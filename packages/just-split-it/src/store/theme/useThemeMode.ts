import { atom, useRecoilState } from 'recoil';

import type { AtomEffectParams } from '../types';

enum ThemeMode {
  DARK = 'dark',
  LIGHT = 'light',
}

const themeModeState = atom({
  key: 'theme-mode-state',
  default: 'dark' as ThemeMode,
  effects: [synchronizeThemeModeWithLocalStorage],
});

function synchronizeThemeModeWithLocalStorage({ setSelf, onSet }: AtomEffectParams) {
  const storedTheme = localStorage.getItem('theme-mode');
  storedTheme && setSelf(storedTheme);
  onSet((value: ThemeMode) => localStorage.setItem('theme-mode', value));
}

export type Actions = {
  toggle: () => void;
};

function useThemeMode(): [ThemeMode, Actions] {
  const [themeMode, setThemeMode] = useRecoilState(themeModeState);

  function toggle() {
    setThemeMode((mode: ThemeMode) => (mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK));
  }

  return [themeMode, { toggle }];
}

export default useThemeMode;
export { ThemeMode };
