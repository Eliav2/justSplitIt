import { createTheme, ThemeProvider } from '@mui/material/styles';
import useThemeMode from '@/store/theme/useThemeMode';
import themes from './themes';
import useLanguage, { useShouldUseRTL } from '@/store/theme/useThemeLanguage';
import { languageLocalesMap } from '@/components/Language';
import React from 'react';

export type CustomThemeProviderProps = {
  children: React.ReactNode;
};

function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  const finalTheme = useFinalTheme();
  return <ThemeProvider theme={finalTheme}>{children}</ThemeProvider>;
}

export const useFinalTheme = () => {
  const [theme] = useThemeMode();
  const shouldUseRTL = useShouldUseRTL();
  const [appLanguage] = useLanguage();
  const muiComponentsLanguageProps = languageLocalesMap[appLanguage];
  const finalTheme = createTheme(themes[theme], muiComponentsLanguageProps, {
    direction: shouldUseRTL ? 'rtl' : 'ltr',
  });

  return finalTheme;
};

export default CustomThemeProvider;
