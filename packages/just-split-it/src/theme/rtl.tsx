import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import useLanguage, { LanguageMode } from "@/store/theme/useThemeLanguage";

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export function RTLSupport(props: any) {
  // return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
  return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

export function RTLProvider(props: any) {
  const [language] = useLanguage();
  if (language == LanguageMode.Hebrew) {
    document.dir = 'rtl';

    return <RTLSupport>{props.children}</RTLSupport>;
  } else {
    document.dir = 'ltr';
    return <>{props.children}</>;
  }
}

export type rtlConfigType = {
  direction: 'ltr' | 'rtl';
};

export const rtlConfig: rtlConfigType = {
  direction: 'rtl',
};
