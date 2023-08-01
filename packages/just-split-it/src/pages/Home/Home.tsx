import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox, FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import useOrientation from '@/hooks/useOrientation';

import { useNavigate } from 'react-router-dom';
import { NewEventDialog } from '@/pages/Home/NewEventDialog';
import Typography from '@mui/material/Typography';
import { fbAuth } from '@/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Button from '@mui/material/Button';
import QueryIndicator from '@/components/QueryIndicator';
import { useLoginUser } from '@/utils/login/useLoginUser';

function Home() {
  // const [user, loading, error] = useAuthState(fbAuth);
  // console.log('user', user);
  const isPortrait = useOrientation();

  const navigate = useNavigate();

  const width = isPortrait ? '40%' : '30%';
  const height = isPortrait ? '30%' : '40%';

  return (
    <>
      <Meta title="JustSplitIt" />
      <FullSizeCenteredFlexBoxColumn>
        <Typography variant={'h1'}>JustSplitIt</Typography>
        <LoginOrAddEventButton />
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

const LoginOrAddEventButton = () => {
  const [user, loading, error] = useAuthState(fbAuth);
  const navigate = useNavigate();
  const { signInWithGoogle } = useLoginUser();

  return (
    <>
      {user ? (
        <NewEventDialog />
      ) : (
        <QueryIndicator loading={loading} errorMessage={error?.message}>
          <Button variant="contained" onClick={signInWithGoogle}>
            Login
          </Button>
          <Typography variant={'body2'}>
            In order to add events, <br />
            You need to log in
          </Typography>
        </QueryIndicator>
      )}
    </>
  );
};

export default Home;
