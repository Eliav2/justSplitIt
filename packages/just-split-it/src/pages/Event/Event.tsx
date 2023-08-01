import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import {
  FullSizeCenteredFlexBoxColumn,
  FullSizeMiddleFlexContainerColumn,
} from '@/components/styled';
import { useParams } from 'react-router-dom';
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

function Event() {
  const [user] = useAuthState(fbAuth);
  const { eventId } = useParams();
  // const { event, loadingEvent, eventSnap } = useGetEvent(eventId as string);
  const event = useGetEvent(eventId as string);
  const userParticipating = user && event.data?.participantsIds?.includes(user?.uid);
  console.log(userParticipating);

  const [expenes, loadingExpenses, expensesError] = useGetEventExpenses(eventId as string);

  const eventExists = event.snap?.exists();
  const eventNotExistsDialogOpen = !event.loading && !eventExists;
  return (
    <>
      <Meta title={event.data?.name ?? 'Event'} description={event.data?.description} />
      <FullSizeMiddleFlexContainerColumn>
        <JoinEventDialog open={!userParticipating} />
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
              {event.data && <NewExpenseDialog parentEvent={event.data} />}
            </>
          ) : (
            <EventDoesNotExistDialog open={eventNotExistsDialogOpen} />
          )}
        </QueryIndicator>
      </FullSizeMiddleFlexContainerColumn>
    </>
  );
}

const JoinEventDialog = ({ open }: { open: boolean }) => {
  function handleCancel() {}

  function handleConfirm() {}

  return (
    <Dialog open={open} disableRestoreFocus>
      <DialogTitle>Join Event</DialogTitle>
      <DialogContent>
        You are not participating in this event <br />
        would you like to join?
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button autoFocus onClick={handleConfirm}>
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
