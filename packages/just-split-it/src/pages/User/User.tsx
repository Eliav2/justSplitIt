import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import CircularProgress from '@mui/material/CircularProgress';
import { fbAuth } from '@/utils/firebase';
import Button from '@mui/material/Button';

const SignOut = () => {
  const [signOut, loading, error] = useSignOut(fbAuth);

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }
  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <>
      <Button
        onClick={async () => {
          const success = await signOut();
          if (success) {
            console.log('signed out');
          }
        }}
      >
        Sign out
      </Button>
    </>
  );
};

function User() {
  const [user, loading, error] = useAuthState(fbAuth);

  if (loading) {
    return (
      <FullSizeCenteredFlexBoxColumn>
        <CircularProgress />
      </FullSizeCenteredFlexBoxColumn>
    );
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <>
      <Meta title="Login" />
      <FullSizeCenteredFlexBoxColumn>
        <Typography>{user?.displayName}</Typography>
        <Typography>{user?.email}</Typography>
        <SignOut />
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

export default User;
