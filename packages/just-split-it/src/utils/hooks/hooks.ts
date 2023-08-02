import { useState } from 'react';
import { FirestoreError } from 'firebase/firestore';
import usePassRef, { usePassChildrenRef } from '@/utils/hooks/usePassRef';

export const useRerender = () => {
  const [, setRender] = useState({});
  return () => setRender({});
};
export const useAsyncHandler = <T extends any, E extends { message: string } = FirestoreError>(
  func: (...args: any[]) => Promise<T>,
  options: {
    onSuccess?: (res: T) => void;
    onError?: (e: E) => void;
  } = {},
) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsyncHandler = async (...args: any[]) => {
    setIsLoading(true);
    const res = await func(...args).catch((e: E) => {
      options.onError?.(e);
      setIsLoading(false);
      setErrorMessage(e.message);
    });
    setIsLoading(false);
    options.onSuccess?.(res as T);
    setErrorMessage('');
    return res;
  };
  return [handleAsyncHandler, isLoading, errorMessage] as const;
};
