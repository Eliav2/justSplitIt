import isMobileDevice from 'is-mobile';

export const isMobile = isMobileDevice();

// detect if the device is on iOS
export const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

// check if the device is in standalone mode
export const isInStandaloneMode = () => {
  return 'standalone' in (window as any).navigator && (window as any).navigator.standalone;
};
