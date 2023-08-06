import { createTheme, ThemeProvider } from '@mui/material/styles';
import useThemeMode from '@/store/theme/useThemeMode';
import themes from './themes';
import useLanguage, { useShouldUseRTL } from '@/store/theme/useThemeLanguage';
import { languageLocalesMap } from '@/components/Language';

export type CustomThemeProviderProps = {
  children: JSX.Element;
};

function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  const [theme] = useThemeMode();
  const shouldUseRTL = useShouldUseRTL();
  const [appLanguage] = useLanguage();
  const muiComponentsLanguageProps = languageLocalesMap[appLanguage];
  const finalTheme = createTheme(themes[theme], muiComponentsLanguageProps, {
    direction: shouldUseRTL ? 'rtl' : 'ltr',
  });

  return <ThemeProvider theme={finalTheme}>{children}</ThemeProvider>;
}

export default CustomThemeProvider;
