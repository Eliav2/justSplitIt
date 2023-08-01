import Loading from '@/components/Loading';
import { FirestoreError } from 'firebase/firestore';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Accordion, AccordionSummary, Collapse, Theme } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from 'react';
import { CenteredFlexBox, FlexBox } from '@/components/styled';
import { styled } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

interface QueryIndicatorProps {
  children: React.ReactNode;
  loading: boolean;
  error?: FirestoreError | null;
}

const QueryIndicator = ({ children, loading, error }: QueryIndicatorProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography>Sorry... Something went wrong</Typography>
        <Box>
          <CenteredFlexBox>
            <Typography onClick={handleExpandClick} style={{ cursor: 'pointer' }}>
              details
            </Typography>

            <RotatingIconButton isRotated={expanded} />
          </CenteredFlexBox>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Typography>{error.message}</Typography>
          </Collapse>
        </Box>
      </Box>
    );
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
