import React, { useState } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

interface FormProps<T extends FieldValues> {
  formHook: UseFormReturn<T, any, undefined>;
  handleAsyncSubmit: (data: T) => Promise<void>;
}
const Form = <T extends UseFormReturn<T>>(props: T) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingState, setLoadingState] = useState<'idle' | 'loading'>('idle');

  return <form></form>;
};

export default Form;
