import Loading from '@/components/Loading';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Collapse } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useState } from 'react';
import { CenteredFlexBox } from '@/components/styled';
import LockIcon from '@mui/icons-material/Lock';
import useDelayedAction from '@/utils/hooks/useDelayedAction';

interface QueryIndicatorProps {
  children: React.ReactNode;
  loading: boolean;
  errorMessage?: string | null;
  loadingIndicator?: React.ReactNode;
  skipLoadingIndicator?: boolean;
}

const QueryIndicator = ({
  children,
  loading,
  errorMessage,
  loadingIndicator = <Loading />,
}: // skipLoadingIndicator = FIRESTORE_PERSISTENT_ENABLED,
QueryIndicatorProps) => {
  const [expanded, setExpanded] = useState(false);
  const delayed = useDelayedAction(300);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  // console.log(error);
  if (errorMessage)
    return (
      <Box sx={{ textAlign: 'center', pt: 2 }}>
        <LockIcon />

        <Typography>
          Sorry... <br />
          It seems like you don't have permissions to view that
        </Typography>
        <Box onClick={handleExpandClick} style={{ cursor: 'pointer' }}>
          <CenteredFlexBox>
            <Typography variant={'body2'}>details</Typography>
            <RotatingIconButton isRotated={expanded} />
          </CenteredFlexBox>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Typography variant={'body2'}>{errorMessage}</Typography>
          </Collapse>
        </Box>
      </Box>
    );

  if (loading) {
    if (delayed) return loadingIndicator;
    return null;
  }
  return children;
};

interface RotatingIconButtonProps {
  isRotated?: boolean;
  icon?: React.FC;
}

const RotatingIconButton = (props: RotatingIconButtonProps) => {
  const [isRotated, setIsRotated] = useState(false);

  const handleRotateClick = () => {
    setIsRotated(!isRotated);
  };
  const Icon = props.icon ?? KeyboardArrowLeftIcon;

  const _isRotated = props.isRotated ?? isRotated;

  return (
    <Icon
      onClick={handleRotateClick}
      style={{
        transform: _isRotated ? 'rotate(-90deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s ease-in-out',
      }}
    />
  );
};

export default QueryIndicator;
