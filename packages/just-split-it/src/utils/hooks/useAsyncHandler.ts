import { useState } from 'react';
import { FirestoreError } from 'firebase/firestore';
import usePassRef, { usePassChildrenRef } from '@/utils/hooks/usePassRef';
import { isPromise } from '@/utils/types/typeGuards';

export const useRerender = () => {
  const [, setRender] = useState({});
  return () => setRender({});
};

/**
 * can handle both async and sync functions
 * if an async function is provided, it will return a promise, and loading and error indicators
 * if a sync function is provided, it will return the result of the function, and loading=false and error=''
 */
export const useAsyncHandler = <
  T extends any,
  E extends { message: string },
  EventsData extends any,
  Args extends any[],
>(
  func: (...args: Args) => T | Promise<T>,
  options: {
    onSuccess?: (res: T, eventsData: EventsData) => void;
    onError?: (e: E, eventsData: EventsData) => void;
  } = {},
) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsyncHandler =
    (eventsData?: EventsData) =>
    async (...args: Args) => {
      setIsLoading(true);
      // const asyncfunc = func()
      const funcRes = func(...args);

      if (isPromise(funcRes)) {
        const awaitedRes = await funcRes.catch((e: E) => {
          options.onError?.(e, eventsData as any);
          setIsLoading(false);
          setErrorMessage(e.message);
        });
        setIsLoading(false);
        options.onSuccess?.(awaitedRes as T, eventsData as any);
        setErrorMessage('');
        return awaitedRes;
      } else {
        setIsLoading(false);
        options.onSuccess?.(funcRes as T, eventsData as any);
        setErrorMessage('');
        return funcRes;
      }
    };
  const createHandler = (eventsData?: EventsData) => handleAsyncHandler(eventsData);

  return [createHandler, isLoading, errorMessage] as const;
};

// // Simpler version
// export const useAsyncHandler = <T extends any, E extends { message: string } = FirestoreError>(
//   func: (...args: any[]) => Promise<T>,
//   options: {
//     onSuccess?: (res: T) => void;
//     onError?: (e: E) => void;
//   } = {},
// ) => {
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//
//   const handleAsyncHandler = async (...args: any[]) => {
//     setIsLoading(true);
//     const res = await func(...args).catch((e: E) => {
//       options.onError?.(e);
//       setIsLoading(false);
//       setErrorMessage(e.message);
//     });
//     setIsLoading(false);
//     options.onSuccess?.(res as T);
//     setErrorMessage('');
//     return res;
//   };
//   return [handleAsyncHandler, isLoading, errorMessage] as const;
// };
