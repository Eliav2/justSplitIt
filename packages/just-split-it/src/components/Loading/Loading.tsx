import CircularProgress from '@mui/material/CircularProgress';

import { FullSizeCenteredFlexBox } from '@/components/styled';
import QueryIndicator from '@/components/QueryIndicator';

function Loading() {
  return (
    <FullSizeCenteredFlexBox>
      <QueryIndicator loading={true}>
        <CircularProgress />
      </QueryIndicator>
    </FullSizeCenteredFlexBox>
  );
}

export default Loading;
