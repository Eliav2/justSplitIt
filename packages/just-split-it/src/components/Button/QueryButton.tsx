import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import QueryIndicator from '@/components/QueryIndicator';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

interface QueryButtonProps extends ButtonProps {
  loading: boolean;
}

const QueryButton = (props: QueryButtonProps) => {
  const { loading, ...rest } = props;
  return (
    <QueryIndicator
      loading={loading}
      loadingIndicator={
        <Tooltip title={'Loading'}>
          <IconButton>
            <CircularProgress />
          </IconButton>
        </Tooltip>
      }
    >
      <Button {...rest} />
    </QueryIndicator>
  );
};

export default QueryButton;
