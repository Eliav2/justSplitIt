import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

function Home() {
  return (
    <>
      <Meta title="page 1" />
      <FullSizeCenteredFlexBox>
        <Typography variant="h3">Page 1</Typography>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Home;
