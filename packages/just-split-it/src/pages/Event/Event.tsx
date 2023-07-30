import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import { useParams } from 'react-router-dom';
import { NewExpenseDialog } from '@/pages/Event/NewExpenseDialog';
import { useGetEvent } from '@/utils/firebase/firestore/queris/hooks';

function Event() {
  const { eventId } = useParams();
  const event = useGetEvent(eventId as string);

  return (
    <>
      <Meta title="Event" />
      <FullSizeCenteredFlexBoxColumn>
        <Typography variant="h3">{event?.name}</Typography>
        {event && <NewExpenseDialog parentEvent={event} />}
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

export default Event;
