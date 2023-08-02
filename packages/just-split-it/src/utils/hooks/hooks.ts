import { useState } from 'react';
import { FirestoreError } from 'firebase/firestore';
import usePassRef, { usePassChildrenRef } from '@/utils/hooks/usePassRef';

export const useRerender = () => {
  const [, setRender] = useState({});
  return () => setRender({});
};
export const useAsyncHandler = <
  T extends any,
  E extends { message: string },
  EventsData extends any,
  Args extends any[],
>(
  func: (...args: Args) => Promise<T>,
  options: {
    onSuccess?: (res: T, eventsData: EventsData) => void;
    onError?: (e: E, eventsData: EventsData) => void;
  } = {},
) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsyncHandler =
    (eventsData: EventsData) =>
    async (...args: Args) => {
      setIsLoading(true);
      // const asyncfunc = func()
      const res = await func(...args).catch((e: E) => {
        options.onError?.(e, eventsData);
        setIsLoading(false);
        setErrorMessage(e.message);
      });
      setIsLoading(false);
      options.onSuccess?.(res as T, eventsData);
      setErrorMessage('');
      return res;
    };
  const createHandler = (eventsData: EventsData) => handleAsyncHandler(eventsData);

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
