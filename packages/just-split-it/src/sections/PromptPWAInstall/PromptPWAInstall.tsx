import * as React from 'react';
import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { isInStandaloneMode, isMobile } from '@/utils/is-mobile';
import Hebrew from '@/components/Language/Hebrew';
import English from '@/components/Language/English';
import { BeforeInstallPromptEvent } from '@/sections/PromptPWAInstall/BeforeInstallPromptEvent';

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

const isPWAInstallSupported = () => {
  return 'BeforeInstallPromptEvent' in window;
};

const isAppInstalled = () => {
  if ('getInstalledRelatedApps' in navigator) {
    const installedRelatedApps = (navigator as any).getInstalledRelatedApps() as Promise<
      {
        platform:
          | 'chrome_web_store'
          | 'play'
          | 'itunes'
          | 'windows'
          | 'webapp'
          | 'f-droid'
          | 'amazon';
        url?: string;
        version?: string;
        id?: string;
      }[]
    >;

    return installedRelatedApps.then((relatedApps) => {
      return relatedApps;
    });
  }
  console.log('getInstalledRelatedApps not supported');
  return Promise.resolve([]);
};

const PromptPWAInstall = () => {
  // navigator.getInstalledRelatedApps()
  console.log('ServiceWorker');
  const installEvent = useRef<BeforeInstallPromptEvent | null>(null);

  console.log('pwaInstallSupported', isPWAInstallSupported());

  // const [openPromptPWAInstall, setOpenPromptPWAInstall] = React.useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt', e);
      // e.preventDefault();
      installEvent.current = e as BeforeInstallPromptEvent;
    });

    window.addEventListener('appinstalled', () => {
      // If visible, hide the install promotion
      // hideInAppInstallPromotion();
      // Log install to analytics
      console.log('INSTALL: Success');
    });

    isAppInstalled().then((relatedApps) => {
      console.log('relatedApps', relatedApps);
    });

    return () => {
      // Clean up event listener when component unmounts
    };
  }, []);
  const shouldPromptInstall = isMobile && !isInStandaloneMode() && isPWAInstallSupported();

  return (
    <div>{shouldPromptInstall && <MobileInstallationDrawer installEvent={installEvent} />}</div>
  );
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

interface MobileInstallationDrawerProps {
  installEvent: React.MutableRefObject<BeforeInstallPromptEvent | null>;
}

export function MobileInstallationDrawer({ installEvent }: MobileInstallationDrawerProps) {
  const [open, setOpen] = React.useState(true);

  const closeDrawer = () => {
    setOpen(false);
  };
  const openDrawer = () => {
    setOpen(true);
  };

  console.log(installEvent.current);

  const installPWA = () => {
    if (installEvent.current) {
      installEvent.current.prompt();
      installEvent.current.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        installEvent.current = null;
      });
    }
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
            <Button variant={'contained'} onClick={installPWA}>
              <Hebrew>התקן</Hebrew>
              <English>Install</English>
            </Button>
            <Button variant={'contained'} href={'https://localhost:4173'} target="_blank">
              <Hebrew>פתח</Hebrew>
            </Button>
            <Button sx={{ color: (theme) => theme.palette.primary.light }} onClick={closeDrawer}>
              <Hebrew>לא תודה</Hebrew>
              <English>No thanks</English>
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
