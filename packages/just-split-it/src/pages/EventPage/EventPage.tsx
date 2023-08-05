import Meta from '@/components/Meta';
import { useParams } from 'react-router-dom';
import { useGetEvent, useParticipantsByIds } from '@/utils/firebase/firestore/queris/get';
import QueryIndicator from '@/components/QueryIndicator';
import { EventDoesNotExistDialog } from '@/pages/EventPage/EventDoesNotExistDialog';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import { JoinEventDialog } from '@/pages/EventPage/JoinEventDialog';
import Event from './Event';
import React from 'react';
import EventContext from './EventContext';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { CenteredFlexBox, FullSizeMiddleFlexContainerColumn } from '@/components/styled';
import { DeleteEventDialogButton } from '@/components/Dialog/DeleteEventDialogButton';
import Button from '@mui/material/Button';
import ParticipantLeaveEventDialogButton from '@/components/Dialog/ParticipantLeaveEventDialogButton';

function EventPage() {
  const [user] = useAuthState(fbAuth);
  const { eventId } = useParams();
  const [event, eventLoading, _, eventSnap] = useGetEvent(eventId as string);
  // const eventData = event && Object.assign({}, event, { id: event.id });

  const isUserParticipating = user && event?.participantsIds?.includes(user?.uid);

  const eventExists = eventSnap?.exists();
  const eventNotExistsDialogOpen = !eventLoading && !eventExists;

  return (
    <FullSizeMiddleFlexContainerColumn>
      <Meta title={event?.name ?? 'Event'} description={event?.description} />
      {eventSnap?.ref && (
        <JoinEventDialog open={!isUserParticipating} eventId={eventSnap?.ref?.id} user={user} />
      )}
      <QueryIndicator loading={eventLoading}>
        {!eventNotExistsDialogOpen && event && eventSnap ? (
          <EventContext.Provider value={event}>
            <Event eventSnap={eventSnap} />
          </EventContext.Provider>
        ) : (
          <EventDoesNotExistDialog open={eventNotExistsDialogOpen} />
        )}
      </QueryIndicator>
    </FullSizeMiddleFlexContainerColumn>
  );
}

export default EventPage;
