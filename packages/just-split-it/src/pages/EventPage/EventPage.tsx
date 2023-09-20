import Meta from '@/components/Meta';
import { useParams } from 'react-router-dom';
import { useGetEvent } from '@/utils/firebase/firestore/queris/get';
import QueryIndicator from '@/components/QueryIndicator';
import { EventDoesNotExistDialog } from '@/pages/EventPage/EventDoesNotExistDialog';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import { JoinEventDialog } from '@/pages/EventPage/JoinEventDialog';
import Event from './Event';
import React from 'react';
import EventContext from './EventContext';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';

function EventPage() {
  const [user] = useAuthState(fbAuth);
  const { eventId } = useParams();
  const [event, eventLoading, _, eventSnap] = useGetEvent(eventId as string);
  // const eventData = event && Object.assign({}, event, { id: event.id });

  const isUserParticipating = user && event?.participantsIds?.includes(user?.uid);

  const eventExists = eventSnap?.exists();
  const eventNotExistsDialogOpen = !eventLoading && !eventExists;

  return (
    <>
      <Meta title={event?.name ?? 'Event'} description={event?.description} />
      <FullSizeCenteredFlexBoxColumn>
        <QueryIndicator loading={eventLoading}>
          {!eventNotExistsDialogOpen && event && eventSnap ? (
            <EventContext.Provider value={event}>
              <JoinEventDialog
                open={!isUserParticipating}
                eventId={eventSnap?.ref?.id}
                user={user}
              />
              <Event eventSnap={eventSnap} />
            </EventContext.Provider>
          ) : (
            <EventDoesNotExistDialog open={eventNotExistsDialogOpen} />
          )}
        </QueryIndicator>
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

export default EventPage;
