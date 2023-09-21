import { useEffect, useRef } from 'react';

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

const ServiceWorker = () => {
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

    document.getElementById('installButton')?.addEventListener('click', installPWA);

    return () => {
      // Clean up event listener when component unmounts
      document.getElementById('installButton')?.removeEventListener('click', installPWA);
    };
  }, []);

  return (
    <div>
      <button onClick={installPWA}>Install App</button>
    </div>
  );
};
export default ServiceWorker;
