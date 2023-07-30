import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import { useParams } from 'react-router-dom';
import { useGetEvent } from '@/utils/firebase/firestore/queries';

function Event() {
  const { eventId } = useParams();
  const event = useGetEvent(eventId as string);

  return (
    <>
      <Meta title="Event" />
      <FullSizeCenteredFlexBoxColumn>
        <Typography variant="h3">{event?.name}</Typography>
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

export default Event;
