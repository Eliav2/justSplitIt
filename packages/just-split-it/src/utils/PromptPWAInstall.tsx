import * as React from 'react';
import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { isInStandaloneMode, isMobile } from '@/utils/is-mobile';
import Hebrew from '@/components/Language/Hebrew';
import English from '@/components/Language/English';

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 */
interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>;

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>;
}

const PWAInstallButton = () => {
  console.log('ServiceWorker');
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  const installPWA = () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      deferredPrompt.current.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt.current = null;
      });
    }
  };

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt', e);
      // e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
    });

    return () => {
      // Clean up event listener when component unmounts
    };
  }, []);

  return <div></div>;
};

const PromptPWAInstall = () => {
  console.log('ServiceWorker');
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  // const [openPromptPWAInstall, setOpenPromptPWAInstall] = React.useState(false);

  const installPWA = () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      deferredPrompt.current.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt.current = null;
      });
    }
  };

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt', e);
      // e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
    });

    // todo: notify that the app was updated
    // const SWWasUpdated = async () => {
    //   console.log('?SWWasUpdated?');
    //   if ('serviceWorker' in navigator) {
    //     const registration = await navigator.serviceWorker.getRegistration();
    //     console.log('registration', registration);
    //     if (!registration) return;
    //     registration.addEventListener('updatefound', () => {
    //       console.log('updatefound');
    //       // A new service worker has been found
    //       const newWorker = registration.installing;
    //
    //       newWorker?.addEventListener('statechange', () => {
    //         // The state of the new service worker has changed
    //         if (newWorker?.state === 'installed') {
    //           // A new service worker has been installed and is ready to take control
    //           console.log('A new service worker is available.');
    //         }
    //       });
    //     });
    //   }
    // };
    // SWWasUpdated();

    return () => {
      // Clean up event listener when component unmounts
    };
  }, []);

  return <div>{isMobile && !isInStandaloneMode() && <MobileInstallationDrawer />}</div>;
};
export default PromptPWAInstall;

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  margin: 'auto',
  marginTop: 8,
  marginBottom: 8,
}));

interface MobileInstallationDrawerProps {}

export function MobileInstallationDrawer({}: MobileInstallationDrawerProps) {
  const [open, setOpen] = React.useState(true);

  const closeDrawer = () => {
    setOpen(false);
  };
  const openDrawer = () => {
    setOpen(true);
  };

  return (
    <div>
      <SwipeableDrawer
        anchor={'bottom'}
        open={open}
        onClose={closeDrawer}
        onOpen={openDrawer}
        // PaperProps={{ sx: { pb: 3 } }}
      >
        <Puller />
        <Box sx={{ px: 2 }}>
          <Typography variant={'h6'}>
            <Hebrew>שמנו לב שאתה גולש ממכשיר נייד!</Hebrew>
            <English>We noticed that you are browsing from a mobile device!</English>
          </Typography>
          <Typography>
            <Hebrew>
              התקנה של האפליקציה תאפשר גישה מהירה יותר לאפליקציה, קבלת התראות, גישת אופליין ועוד!
              האם תרצה להתקין אותה?
            </Hebrew>
            <English>
              Installing the app will allow faster access to the app, receiving notifications,
              offline access and more! Would you like to install it?
            </English>
          </Typography>
          <Box
            // sx={{ width: 'auto' }}
            sx={{ display: 'flex', justifyContent: 'center', gap: '10%', p: 2 }}
            role="presentation"
            onClick={openDrawer}
            onKeyDown={closeDrawer}
          >
            <Button variant={'contained'}>
              <Hebrew>התקן</Hebrew>
              <English>Install</English>
            </Button>
            <Button sx={{ color: (theme) => theme.palette.primary.light }}>
              <Hebrew>לא תודה</Hebrew>
              <English>No thanks</English>
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
