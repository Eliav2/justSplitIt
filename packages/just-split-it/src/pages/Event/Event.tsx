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
  const [event, eventLoading] = useGetEvent(eventId as string);

  const eventData = event && Object.assign({}, event.data(), { id: event.id });

  const isUserParticipating = user && eventData?.participantsIds?.includes(user?.uid);

  // const expensesQuery = useGetEventExpenses(eventId as string);
  const [expenses, loading, error] = useGetEventExpenses(eventId as string, event);

  // console.log(expenses);
  // const {
  //   docs: expenes,
  //   loading: loadingExpenses,
  //   error: expensesError,
  //
  // } = useGetEventExpenses(eventId as string);

  useEffect(() => {
    console.log('event changed', event);
    // expensesQuery.refresh();
    // event.refresh();
  }, [event]);

  // console.log('expensesError', expensesError);

  const eventExists = event?.exists();
  const eventNotExistsDialogOpen = !eventLoading && !eventExists;

  const isOwner = user?.uid === eventData?.ownerId;
  return (
    <>
      <Meta title={eventData?.name ?? 'Event'} description={eventData?.description} />
      <FullSizeMiddleFlexContainerColumn>
        {event?.ref && (
          <JoinEventDialog open={!isUserParticipating} eventId={event?.ref?.id} user={user} />
        )}
        <QueryIndicator loading={eventLoading}>
          {!eventNotExistsDialogOpen ? (
            <>
              <Typography variant="h3">{eventData?.name}</Typography>

              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <QueryIndicator
                  loading={loading}
                  errorMessage={error?.message}
                  // loading={expensesQuery.loading}
                  // errorMessage={expensesQuery.error?.message}
                >
                  {expenses?.docs.map((expene, expenseIndex) => {
                    return <ExpenseListItem expenseId={expene.id} key={expene.id} />;
                  })}
                  {/*{expensesQuery.docs.map((expene, expenseIndex) => {*/}
                  {/*  retu rn <ExpenseListItem expenseId={expene.id} key={expene.id} />;*/}
                  {/*})}*/}
                </QueryIndicator>
              </List>
              {eventData && (
                <>
                  <NewExpenseDialog parentEvent={eventData} />
                  {isOwner ? (
                    <DeleteEventDialogButton
                      event={eventData}
                      buttonElement={(handleOpen) => (
                        <Button onClick={handleOpen} color={'warning'}>
                          Delete Event
                        </Button>
                      )}
                    />
                  ) : (
                    <ParticipantLeaveEventDialogButton eventId={event.id} />
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
