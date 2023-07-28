import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';

function Home() {
  return (
    <>
      <Meta title="Home" />
      <FullSizeCenteredFlexBoxColumn>
        <Typography variant="h3">Home page</Typography>
        <Typography variant="h3">here</Typography>
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

export default Home;
