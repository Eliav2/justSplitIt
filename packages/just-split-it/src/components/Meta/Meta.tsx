import { Helmet } from 'react-helmet-async';

import { title as appTitle, defaultMetaTags } from '@/config';

import type { MetaProps } from './types';
import { useFinalTheme } from '@/theme/Provider';

function Meta({
  description = defaultMetaTags.description,
  meta = [],
  title,
  // image = defaultMetaTags.image,
  image,
}: MetaProps) {
  const pageTitle = `${appTitle}${title ? ' | ' + title : ''}`;
  const theme = useFinalTheme();
  const primaryColor = theme.palette.primary.main;

  return (
    <Helmet
      title={pageTitle}
      meta={[
        { name: 'theme-color', content: primaryColor },
        {
          name: 'description',
          content: description,
        },
        {
          property: 'og:title',
          content: pageTitle,
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:image',
          content: image,
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:title',
          content: pageTitle,
        },
        {
          name: 'twitter:description',
          content: description,
        },
      ].concat(meta)}
    />
  );
}

export default Meta;
