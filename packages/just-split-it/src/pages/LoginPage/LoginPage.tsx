import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { fbAuth } from '@/utils/firebase/firebase';
import Button from '@mui/material/Button';
import QueryIndicator from '@/components/QueryIndicator';
import { useLoginUser } from '@/utils/login/useLoginUser';

function LoginPage() {
  const [user, loading, error] = useAuthState(fbAuth);
  const { signInWithGoogle } = useLoginUser();
  const returnUrl = new URLSearchParams(location.search).get('fallback');

  // if authenticated, redirect to root page
  if (user) {
    // If there's a returnURL, navigate to it after login
    if (returnUrl) {
      return <Navigate to={returnUrl} />;
    }
    // If no returnURL, navigate to Home Page
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

export default LoginPage;
