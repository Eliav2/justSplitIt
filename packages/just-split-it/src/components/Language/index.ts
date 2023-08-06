import useLanguage from '@/store/theme/useThemeLanguage';

export enum LanguageMode {
  English = 'English',
  Hebrew = 'עברית',
}

export const useLanguageSentence = (sentences: Record<LanguageMode, string>) => {
  const [language] = useLanguage();
  return sentences[language];
};
