import { ThemeProvider, createTheme } from '@mui/material/styles';

import useAppTheme from '@/store/theme';

import themes from './themes';
import type { CustomThemeProviderProps } from './types';

function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  const [theme] = useAppTheme();
  theme;

  return <ThemeProvider theme={createTheme(themes[theme])}>{children}</ThemeProvider>;
}

export default CustomThemeProvider;
