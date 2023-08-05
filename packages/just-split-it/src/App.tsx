import { Fragment } from 'react';

import CssBaseline from '@mui/material/CssBaseline';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import AppPages from '@/routes/AppPages';
import HotKeys from '@/sections/HotKeys';
import Notifications from '@/sections/Notifications';
import SW from '@/sections/SW';
import { useEnsureUserExists } from '@/utils/firebase/firestore/hooks/util';
import { rtlConfig, RTLSupport } from '@/theme/rtl';

// import { router } from '@/routes/AppPages/AppPages';

document.dir = rtlConfig.direction;

function App() {
  useEnsureUserExists();
  return (
    <Fragment>
      <CssBaseline />
      <RTLSupport>
        <Notifications />
        <HotKeys />
        <SW />
        <AppPages />
      </RTLSupport>
    </Fragment>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
