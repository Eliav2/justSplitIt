import { createTheme, ThemeProvider } from '@mui/material/styles';
import useThemeMode from '@/store/theme/useThemeMode';
import themes from './themes';
import useLanguage, { useShouldUseRTL } from '@/store/theme/useThemeLanguage';

export type CustomThemeProviderProps = {
  children: JSX.Element;
};

function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  const [theme] = useThemeMode();
  const shouldUseRTL = useShouldUseRTL();
  const finalTheme = { ...createTheme(themes[theme]), direction: shouldUseRTL ? 'rtl' : 'ltr' };

  return <ThemeProvider theme={finalTheme}>{children}</ThemeProvider>;
}

export default CustomThemeProvider;
