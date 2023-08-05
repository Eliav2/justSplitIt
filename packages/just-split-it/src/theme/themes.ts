import { ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

import { DeepmergeOptions } from '@mui/utils/deepmerge';
import { rtlConfig } from '@/theme/rtl';
import { ThemeMode } from '@/store/theme/useThemeMode';

const sharedTheme = {
  direction: rtlConfig.direction,
  typography: {
    // fontFamily: 'Assistant, sans-serif',
    // fontFamily: [
    //   '-apple-system',
    //   'BlinkMacSystemFont',
    //   '"Segoe UI"',
    //   'Roboto',
    //   '"Helvetica Neue"',
    //   'Arial',
    //   'sans-serif',
    //   '"Apple Color Emoji"',
    //   '"Segoe UI Emoji"',
    //   '"Segoe UI Symbol"',
    // ].join(','),
    // h1: { fontFamily: "Opan-sans" },
  },
  palette: {
    background: {
      default: '#fafafa',
      paper: '#fff',
    },
  },
  components: {
    MuiButtonBase: {
      // defaultProps: {
      //   disableRipple: true,
      // },
    },
    MuiDivider: {
      styleOverrides: {
        vertical: {
          marginRight: 10,
          marginLeft: 10,
        },
        // TODO: open issue for missing "horizontal" CSS rule
        // in Divider API - https://mui.com/material-ui/api/divider/#css
        middle: {
          marginTop: 10,
          marginBottom: 10,
          width: '80%',
        },
      },
    },
  },
} as ThemeOptions; // the reason for this casting is deepmerge return type
// TODO (Suren): replace mui-utils-deepmerge with lodash or ramda deepmerge

const _deepmerge = deepmerge as <T, K>(target: T, source: K, options?: DeepmergeOptions) => T & K;
const themes = {
  light: _deepmerge(sharedTheme, {
    palette: {
      mode: 'light',
      background: {
        default: '#fafafa',
        paper: '#fff',
      },
      primary: {
        main: '#863fb5',
        mainLight: '#f1c8ff',
      },
    },
    userOwnExpenseColor: '#f6f0ff',
  }),

  dark: _deepmerge(sharedTheme, {
    palette: {
      mode: 'dark',
      background: {
        default: '#111',
        paper: '#171717',
      },
      primary: {
        main: '#f1c8ff',
      },
    },
    userOwnExpenseColor: '#302c34',
  }),
} as const satisfies Record<ThemeMode, ThemeOptions>;

export type AppTheme = (typeof themes)[keyof typeof themes];

export default themes;
