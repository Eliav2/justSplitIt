import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import {
  FullSizeCenteredFlexBoxColumn,
  FullSizeMiddleFlexContainerColumn,
} from '@/components/styled';
import { useNavigate, useParams } from 'react-router-dom';
import { NewExpenseDialog } from '@/pages/Event/NewExpenseDialog';
import { useGetEvent, useGetEventExpenses } from '@/utils/firebase/firestore/queris/hooks';
import List from '@mui/material/List';
import QueryIndicator from '@/components/QueryIndicator';
import { EventDoesNotExistDialog } from '@/pages/Event/EventDoesNotExistDialog';
import { ExpenseListItem } from '@/pages/Event/ExpenseListItem';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import { addParticipantToEvent } from '@/utils/firebase/firestore/queris/queries';
import type { User } from 'firebase/auth';
import ConfirmDeleteDialogButton from '@/components/Dialog/ConfirmDeleteDialogButton';

import { DeleteEventDialogButton } from '@/components/Dialog/DeleteEventDialogButton';

function Event() {
  const [user] = useAuthState(fbAuth);
  const { eventId } = useParams();
  // const { event, loadingEvent, eventSnap } = useGetEvent(eventId as string);
  const event = useGetEvent(eventId as string);
  const isUserParticipating = user && event.data?.participantsIds?.includes(user?.uid);

  const [expenes, loadingExpenses, expensesError] = useGetEventExpenses(eventId as string);

  const eventExists = event.snap?.exists();
  const eventNotExistsDialogOpen = !event.loading && !eventExists;

  const isOwner = user?.uid === event.data?.ownerId;
  return (
    <>
      <Meta title={event.data?.name ?? 'Event'} description={event.data?.description} />
      <FullSizeMiddleFlexContainerColumn>
        {event.ref && (
          <JoinEventDialog open={!isUserParticipating} eventId={event.ref?.id} user={user} />
        )}
        <QueryIndicator loading={event.loading}>
          {!eventNotExistsDialogOpen ? (
            <>
              <Typography variant="h3">{event.data?.name}</Typography>

              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <QueryIndicator loading={loadingExpenses} error={expensesError}>
                  {expenes.map((expene, expenseIndex) => {
                    return <ExpenseListItem expenseId={expene.id} key={expene.id} />;
                  })}
                </QueryIndicator>
              </List>
              {event.data && (
                <>
                  <NewExpenseDialog parentEvent={event.data} />
                  {isOwner && (
                    <DeleteEventDialogButton
                      event={event.data}
                      buttonElement={(handleOpen) => (
                        <Button onClick={handleOpen} color={'warning'}>
                          Delete Event
                        </Button>
                      )}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <EventDoesNotExistDialog open={eventNotExistsDialogOpen} />
          )}
        </QueryIndicator>
      </FullSizeMiddleFlexContainerColumn>
    </>
  );
}
<ConfirmDeleteDialogButton
  handleConfirm={() => {}}
  content={
    <DialogContent>
      Are you sure? <br />
      This will delete this action cannot be undone.
    </DialogContent>
  }
  buttonElement={(handleOpen) => (
    <Button onClick={handleOpen} color={'warning'}>
      Delete Event
    </Button>
  )}
/>;
interface JoinEventDialogProps {
  open: boolean;
  user: User | null;
  eventId: string;
}

const JoinEventDialog = (props: JoinEventDialogProps) => {
  const navigate = useNavigate();

  function handleReject() {
    navigate('/');
  }

  function handleJoin() {
    if (!props.user?.uid) return;
    addParticipantToEvent(props.eventId, props.user?.uid);
  }

  return (
    <Dialog open={props.open} disableRestoreFocus>
      <DialogTitle>Join Event</DialogTitle>
      <DialogContent>
        You are not participating in this event <br />
        would you like to join?
      </DialogContent>

      <DialogActions>
        <Button onClick={handleReject}>Nope. I'm out</Button>
        <Button autoFocus onClick={handleJoin}>
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Event;

//
// import * as React from 'react';
//
// function CheckboxList() {
//
//     return (
//
//     );
// }
