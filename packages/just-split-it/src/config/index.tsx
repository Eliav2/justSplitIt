import isMobile from '@/utils/is-mobile';

import type { Notifications } from './types';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';

const title = 'JustSplitIt';

const email = 'louski.a@gmail.com';

const repository = 'https://github.com/Eliav2/justSplitIt';

const messages = {
  app: {
    crash: {
      title: (
        <>
          <English>Oooops... Sorry, something went wrong. You can:</English>
          <Hebrew>אופס... סורי, משהו השתבש. אתה יכול:</Hebrew>
        </>
      ),
      options: {
        email: (
          <>
            <English>contact with author by this email - {email}</English>
            <Hebrew>צור קשר עם יוצר האפליקציה במייל - {email} </Hebrew>
          </>
        ),
        reset: (
          <>
            <English>Press here to reset the application</English>
            <Hebrew>לחץ כאן כדי לאתחל את האפליקציה</Hebrew>
          </>
        ),
      },
    },
  },
  loader: {
    fail: 'Hmmmmm, there is something wrong with this component loading process... Maybe trying later would be the best idea',
  },
  images: {
    failed: 'something went wrong during image loading :(',
  },
  404: 'Hey bro? What are you looking for?',
};

const dateFormat = 'MMMM DD, YYYY';

const notifications: Notifications = {
  options: {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    autoHideDuration: 6000,
  },
  maxSnack: isMobile ? 3 : 4,
};

const loader = {
  // no more blinking in your app
  delay: 300, // if your asynchronous process is finished during 300 milliseconds you will not see the loader at all
  minimumLoading: 700, // but if it appears, it will stay for at least 700 milliseconds
};

const defaultMetaTags = {
  image: '/cover.png',
  description: 'Just-SplitIt - shared expenses made easy',
};
const giphy404 = 'https://giphy.com/embed/xTiN0L7EW5trfOvEk0';

export {
  loader,
  notifications,
  dateFormat,
  messages,
  repository,
  email,
  title,
  defaultMetaTags,
  giphy404,
};
