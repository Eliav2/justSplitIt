import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import Button from '@mui/material/Button';
import Loading from '@/components/Loading';

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
        onClick={() => {
          signOut();
        }}
      >
        Sign out
      </Button>
    </>
  );
};

function UserPage() {
  const [user, loading, error] = useAuthState(fbAuth);

  if (loading) {
    return <Loading />;
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

export default UserPage;
