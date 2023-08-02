import Meta from '@/components/Meta';
import { useParams } from 'react-router-dom';
import { useGetEvent } from '@/utils/firebase/firestore/queris/hooks';
import QueryIndicator from '@/components/QueryIndicator';
import { EventDoesNotExistDialog } from '@/pages/Event/EventDoesNotExistDialog';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import { JoinEventDialog } from '@/pages/Event/JoinEventDialog';
import ExpensesList from './ExpensesList';

function Event() {
  const [user] = useAuthState(fbAuth);
  const { eventId } = useParams();
  const [event, eventLoading] = useGetEvent(eventId as string);
  const eventData = event && Object.assign({}, event.data(), { id: event.id });

  const isUserParticipating = user && eventData?.participantsIds?.includes(user?.uid);

  const eventExists = event?.exists();
  const eventNotExistsDialogOpen = !eventLoading && !eventExists;

  return (
    <>
      <Meta title={eventData?.name ?? 'Event'} description={eventData?.description} />
      {event?.ref && (
        <JoinEventDialog open={!isUserParticipating} eventId={event?.ref?.id} user={user} />
      )}
      <QueryIndicator loading={eventLoading}>
        {!eventNotExistsDialogOpen && event ? (
          <ExpensesList event={event} />
        ) : (
          <EventDoesNotExistDialog open={eventNotExistsDialogOpen} />
        )}
      </QueryIndicator>
    </>
  );
}

export default Event;
