import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import Button from '@mui/material/Button';
import Loading from '@/components/Loading';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';
import QueryIndicator from '@/components/QueryIndicator';

const SignOut = () => {
  const [signOut, loading, error] = useSignOut(fbAuth);

  return (
    <QueryIndicator loading={loading} errorMessage={error?.message}>
      <Button
        onClick={() => {
          signOut();
        }}
      >
        <English>Sign out</English>
        <Hebrew>התנתק</Hebrew>
      </Button>
    </QueryIndicator>
  );
};

function UserPage() {
  const [user, loading, error] = useAuthState(fbAuth);

  return (
    <>
      <Meta title="Login" />
      <FullSizeCenteredFlexBoxColumn>
        <QueryIndicator loading={loading} errorMessage={error?.message}>
          <Typography>{user?.displayName}</Typography>
          <Typography>{user?.email}</Typography>
          <SignOut />
        </QueryIndicator>
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

export default UserPage;
