import { createTheme, ThemeProvider } from '@mui/material/styles';
import useThemeMode from '@/store/theme/useThemeMode';
import themes from './themes';

export type CustomThemeProviderProps = {
  children: JSX.Element;
};

function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  const [theme] = useThemeMode();
  return <ThemeProvider theme={createTheme(themes[theme])}>{children}</ThemeProvider>;
}

export default CustomThemeProvider;
