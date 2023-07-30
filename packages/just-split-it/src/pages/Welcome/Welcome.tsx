import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox, FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import useOrientation from '@/hooks/useOrientation';

import muiLogo from './logos/mui.svg';
import pwaLogo from './logos/pwa.svg';
import reactLogo from './logos/react_ed.svg';
import recoilLogo from './logos/recoil.svg';
import rrLogo from './logos/rr.svg';
import tsLogo from './logos/ts.svg';
import viteLogo from './logos/vite.svg';
import { Image } from './styled';
import { useNavigate } from 'react-router-dom';
import { NewEventDialog } from '@/pages/Welcome/NewEventDialog';

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
        <FullSizeCenteredFlexBox flexDirection={isPortrait ? 'column' : 'row'}>
          <Image alt="react-router" src={rrLogo} />
          <Image alt="vite" src={viteLogo} />
          <Image alt="typescript" src={tsLogo} />
          <Image alt="react" src={reactLogo} sx={{ width, height }} />
          <Image alt="mui" src={muiLogo} />
          <Image alt="recoil" src={recoilLogo} />
          <Image alt="pwa" src={pwaLogo} />
        </FullSizeCenteredFlexBox>
        <NewEventDialog />
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

export default Welcome;
