import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeMiddleFlexContainerColumn } from '@/components/styled';
import { useParams } from 'react-router-dom';
import { NewExpenseDialog } from '@/pages/Event/NewExpenseDialog';
import { useGetEvent, useGetEventExpenses } from '@/utils/firebase/firestore/queris/hooks';
import List from '@mui/material/List';
import QueryIndicator from '@/components/QueryIndicator';
import { EventDoesNotExistDialog } from '@/pages/Event/EventDoesNotExistDialog';
import { ExpenseListItem } from '@/pages/Event/ExpenseListItem';
import Button from '@mui/material/Button';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';

import { DeleteEventDialogButton } from '@/components/Dialog/DeleteEventDialogButton';
import { JoinEventDialog } from '@/pages/Event/JoinEventDialog';
import ParticipantLeaveEventDialogButton from '@/components/Dialog/ParticipantLeaveEventDialogButton';
import { useEffect } from 'react';

function Event() {
  const [user] = useAuthState(fbAuth);
  const { eventId } = useParams();
  // const { event, loadingEvent, eventSnap } = useGetEvent(eventId as string);
  const event = useGetEvent(eventId as string);
  const isUserParticipating = user && event.data?.participantsIds?.includes(user?.uid);

  // useEffect(() => {
  //   console.log('event changed');
  // }, [event]);

  const [expenes, loadingExpenses, expensesError] = useGetEventExpenses(eventId as string);
  // console.log('expensesError', expensesError);

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
                  {isOwner ? (
                    <DeleteEventDialogButton
                      event={event.data}
                      buttonElement={(handleOpen) => (
                        <Button onClick={handleOpen} color={'warning'}>
                          Delete Event
                        </Button>
                      )}
                    />
                  ) : (
                    <ParticipantLeaveEventDialogButton eventId={event.data.id} />
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

export default Event;
