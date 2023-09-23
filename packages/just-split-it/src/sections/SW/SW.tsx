import { useCallback, useEffect, useRef } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import type { SnackbarKey } from 'notistack';
import { useRegisterSW } from 'virtual:pwa-register/react';

import useNotifications from '@/store/notifications';
import { LanguageMode } from '@/components/Language';
import { useLanguageSentence } from '@/store/theme/useThemeLanguage';
import Hebrew from '@/components/Language/Hebrew';
import English from '@/components/Language/English';

// TODO (Suren): this should be a custom hook :)
function SW() {
  const [, notificationsActions] = useNotifications();
  const notificationKey = useRef<SnackbarKey | null>(null);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = useCallback(() => {
    setOfflineReady(false);
    setNeedRefresh(false);

    if (notificationKey.current) {
      notificationsActions.close(notificationKey.current);
    }
  }, [setOfflineReady, setNeedRefresh, notificationsActions]);

  const newContentMessage = useLanguageSentence({
    [LanguageMode.Hebrew]: 'תוכן חדש זמין, לחץ על כפתור טען מחדש כדי לעדכן',
    [LanguageMode.English]: 'New content is available, click on reload button to update.',
  });

  useEffect(() => {
    if (offlineReady) {
      notificationsActions.push({
        options: {
          autoHideDuration: 4500,
          content: <Alert severity="success">App is ready to work offline.</Alert>,
        },
      });
    } else if (needRefresh) {
      notificationKey.current = notificationsActions.push({
        message: newContentMessage,
        options: {
          variant: 'warning',
          persist: true,
          action: (
            <>
              <Button onClick={() => updateServiceWorker(true)}>
                <English>Reload</English>
                <Hebrew>טען מחדש</Hebrew>
              </Button>
              <Button onClick={close}>
                <English>Close</English>
                <Hebrew>סגור</Hebrew>
              </Button>
            </>
          ),
        },
      });
    }
  }, [close, needRefresh, offlineReady, notificationsActions, updateServiceWorker]);

  return null;
}

export default SW;
