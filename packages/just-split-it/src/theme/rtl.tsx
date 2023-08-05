import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export function RTLSupport(props: any) {
  // return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
  return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

export type rtlConfigType = {
  direction: 'ltr' | 'rtl';
};

export const rtlConfig: rtlConfigType = {
  direction: 'ltr',
};
