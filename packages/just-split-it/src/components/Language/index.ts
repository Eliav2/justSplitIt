import { heIL, enUS } from '@mui/material/locale';

export enum LanguageMode {
  English = 'English',
  Hebrew = 'עברית',
}

export const languageLocalesMap = {
  [LanguageMode.English]: enUS,
  [LanguageMode.Hebrew]: heIL,
};
