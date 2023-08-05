import { useEffect, useState } from 'react';

function useDelayedAction(delayMS: number) {
  const [isDelayPassed, setIsDelayPassed] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => setIsDelayPassed(true), delayMS);

    return () => clearTimeout(timerId);
  }, []);
  return isDelayPassed;
}

export default useDelayedAction;
