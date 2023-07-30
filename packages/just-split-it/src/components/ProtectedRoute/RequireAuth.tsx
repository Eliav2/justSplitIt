import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useLocation } from 'react-router-dom';
import { fbAuth } from '@/utils/firebase/firebase';
import Loading from '@/components/Loading';

function RequireAuth({ children }: { children: JSX.Element }) {
  const [user, loading, error] = useAuthState(fbAuth);
  const location = useLocation();

  // console.log(user, loading, error);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they log in, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
export default RequireAuth;
