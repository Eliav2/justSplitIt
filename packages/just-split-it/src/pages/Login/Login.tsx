import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate } from 'react-router-dom';
import { fbAuth } from '@/utils/firebase';
import Button from '@mui/material/Button';

const useLoginUser = () => {
  // // NOTE: currently this breaks firebase auth
  // useEffect(() => {
  //   fbAuth.setPersistence(inMemoryPersistence);
  //
  //   console.log("useLoginUser");
  //   console.log(fbAuth.currentUser?.getIdToken());
  // }, []);

  // const login = async () => {
  //   // When the user signs in with email and password.
  //   signInWithEmailAndPassword(fbAuth,'user@example.com', 'password').then(user => {
  //     // Get the user's ID token as it is needed to exchange for a session cookie.
  //     return user.getIdToken().then(idToken => {
  //       // Session login endpoint is queried and the session cookie is set.
  //       // CSRF protection should be taken into account.
  //       // ...
  //       const csrfToken = getCookie('csrfToken')
  //       return postIdTokenToSessionLogin('/sessionLogin', idToken, csrfToken);
  //     });
  //   }).then(() => {
  //     // A page redirect would suffice as the persistence is set to NONE.
  //     return firebase.auth().signOut();
  //   }).then(() => {
  //     window.location.assign('/profile');
  //   });
  // }

  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(fbAuth, provider)
      .then((result) => {
        // // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential!.accessToken;
        // // The signed-in user info.
        // const user = result.user;
        // // IdP data available using getAdditionalUserInfo(result)
        // // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);

        // ...
      });
  }

  return { signInWithGoogle };
};

function Login() {
  const [user, loading, error] = useAuthState(fbAuth);
  const { signInWithGoogle } = useLoginUser();

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  // if authenticated, redirect to root page
  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Meta title="Login" />
      <FullSizeCenteredFlexBoxColumn>
        <Typography>You are not logged in.</Typography>
        <Button onClick={signInWithGoogle}>Sign in</Button>
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

export default Login;
