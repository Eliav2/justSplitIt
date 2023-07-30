import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox, FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import useOrientation from '@/hooks/useOrientation';

import { useNavigate } from 'react-router-dom';
import { NewEventDialog } from '@/pages/Welcome/NewEventDialog';
import Typography from '@mui/material/Typography';

function Welcome() {
  // const [user, loading, error] = useAuthState(fbAuth);
  // console.log('user', user);
  const isPortrait = useOrientation();

  const navigate = useNavigate();

  const width = isPortrait ? '40%' : '30%';
  const height = isPortrait ? '30%' : '40%';

  return (
    <>
      <Meta title="Welcome" />
      <FullSizeCenteredFlexBoxColumn>
        <Typography variant={'h1'}>JustSplitIt</Typography>
        <NewEventDialog />
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

export default Welcome;
