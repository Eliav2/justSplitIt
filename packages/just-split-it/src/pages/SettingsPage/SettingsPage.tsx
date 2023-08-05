import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import { useLoginUser } from '@/utils/login/useLoginUser';
import { SelectLanguage } from '@/components/Language/SelectLanguage';
import Typography from '@mui/material/Typography';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';

function SettingsPage() {
  const [user, loading, error] = useAuthState(fbAuth);
  const { signInWithGoogle } = useLoginUser();
  const returnUrl = new URLSearchParams(location.search).get('fallback');

  return (
    <>
      <Meta title="Login" />
      <FullSizeCenteredFlexBoxColumn>
        <Typography>
          <English>App Language</English>
          <Hebrew>שפת האפליקציה</Hebrew>
        </Typography>
        <SelectLanguage />
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

export default SettingsPage;
