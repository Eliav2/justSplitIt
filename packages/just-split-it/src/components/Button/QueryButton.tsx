import React, { useState } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import Loading from '@/components/Loading';

interface QueryButtonProps extends ButtonProps {}

const QueryButton = (props: QueryButtonProps) => {
  const [loadingState, setLoadingState] = useState<'idle' | 'loading'>('idle');

  return <Button type={'submit'}>{loadingState == 'idle' ? 'Create' : <Loading />}</Button>;
};

export default QueryButton;
