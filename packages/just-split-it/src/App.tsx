import { Fragment } from 'react';

import CssBaseline from '@mui/material/CssBaseline';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import AppPages from '@/routes/AppPages';
import HotKeys from '@/sections/HotKeys';
import Notifications from '@/sections/Notifications';
import SW from '@/sections/SW';
import { useEnsureUserExists } from '@/utils/firebase/firestore/hooks/util';

// import { router } from '@/routes/AppPages/AppPages';

function App() {
  useEnsureUserExists();
  return (
    <Fragment>
      <CssBaseline />
      <Notifications />
      <HotKeys />
      <SW />
      <AppPages />
    </Fragment>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
