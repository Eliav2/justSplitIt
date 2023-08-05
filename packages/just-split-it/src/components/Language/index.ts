import useLanguage, { LanguageMode } from '@/store/theme/useThemeLanguage';

export const useLanguageSentence = (sentences: Record<LanguageMode, string>) => {
  const [language] = useLanguage();
  return sentences[language];
};
