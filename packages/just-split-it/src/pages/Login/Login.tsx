import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { fbAuth } from '@/utils/firebase/firebase';
import Button from '@mui/material/Button';
import QueryIndicator from '@/components/QueryIndicator';
import { useLoginUser } from '@/utils/login/useLoginUser';

function Login() {
  const [user, loading, error] = useAuthState(fbAuth);
  const { signInWithGoogle } = useLoginUser();

  // if authenticated, redirect to root page
  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Meta title="Login" />
      <FullSizeCenteredFlexBoxColumn>
        <QueryIndicator loading={loading} errorMessage={error?.message}>
          <Typography>You are not logged in.</Typography>
          <Button onClick={signInWithGoogle}>Sign in</Button>
        </QueryIndicator>
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

export default Login;
