import { DocumentSnapshot } from 'firebase/firestore';
import { FirestoreEvent } from '@/utils/firebase/firestore/schema';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import { useGetEventExpenses, useParticipantsByIds } from '@/utils/firebase/firestore/queris/get';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import QueryIndicator from '@/components/QueryIndicator';
import { ExpenseListItem } from '@/pages/EventPage/Event/ExpenseListItem/ExpenseListItem';
import { NewExpenseDialogButton } from '@/pages/EventPage/Event/NewExpenseDialogButton';
import { DeleteEventDialogButton } from '@/components/Dialog/DeleteEventDialogButton';
import Button from '@mui/material/Button';
import ParticipantLeaveEventDialogButton from '@/components/Dialog/ParticipantLeaveEventDialogButton';
import { round, sumArray } from '@/utils/math';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { UserNotParticipating } from '@/pages/EventPage/Event/UserNotParticipating';
import Divider from '@mui/material/Divider';
import { CenteredFlexBox, FlexBox } from '@/components/styled';
import React from 'react';

interface ExpensesListProps {
  eventSnap: DocumentSnapshot<FirestoreEvent>;
}

const Event = ({ eventSnap }: ExpensesListProps) => {
  const [user, loadingUser] = useAuthState(fbAuth);
  const eventData = eventSnap && Object.assign({}, eventSnap.data(), { id: eventSnap.id });
  const isUserParticipating = user && eventData?.participantsIds?.includes(user?.uid);

  const [participants, loadingParticipants, errorParticipants] = useParticipantsByIds(
    eventData?.participantsIds,
  );
  const isOwner = user?.uid === eventData?.ownerId;

  const [expenses, loading, error] = useGetEventExpenses(eventSnap.id as string, [
    isUserParticipating,
  ]);

  const expensesData = expenses?.docs.map((expense) => expense.data());
  const eventTotalExpense = sumArray(expensesData?.map((expense) => expense.amount) ?? []);

  const userPayedFor = round(
    expensesData?.reduce((acc, expense) => {
      if (expense.payerId === user?.uid) {
        return acc + expense.amount;
      }
      return acc;
    }, 0) ?? 0,
  );

  const userShouldPay =
    (user &&
      expensesData?.map((expense) => {
        if (!expense.participantsIds.includes(user?.uid))
          return { expense: expense.name, amount: 0 };
        return { expense: expense.name, amount: expense.amount / expense.participantsIds.length };
      }, 0)) ??
    [];

  const userTotalExpense = round(sumArray(userShouldPay.map((expense) => expense.amount)));

  const userBalance = round(userPayedFor - userTotalExpense);

  // console.log(userExpenses);
  // console.log(userTotalExpense);

  const owedColor = '#1ECC00';
  const ownColor = '#CC8900';
  return (
    <QueryIndicator loading={loadingUser}>
      <Typography variant="h3">{eventData?.name}</Typography>

      {isUserParticipating ? (
        <Paper sx={{ p: 2 }}>
          <Typography>Expenses</Typography>

          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <QueryIndicator loading={loading} errorMessage={error?.message}>
              {expenses?.docs.map((expene, expenseIndex) => {
                return (
                  <ExpenseListItem eventData={eventData} expenseId={expene.id} key={expene.id} />
                );
              })}
            </QueryIndicator>
          </List>
          <List dense>
            <ListItem>
              <ListItemText sx={{}}>Total Expenses: {eventTotalExpense}₪</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText sx={{}}>You Should Pay back: {userTotalExpense}₪</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText sx={{}}>You Paid for: {userPayedFor}₪</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText sx={{}}>
                {userBalance > 0 ? (
                  <span style={{ color: owedColor }}>You are owed {userBalance}₪</span>
                ) : (
                  <span style={{ color: ownColor }}>You owe {userBalance * -1}₪</span>
                )}
              </ListItemText>
            </ListItem>
          </List>

          <CenteredFlexBox>
            <NewExpenseDialogButton parentEvent={eventData} />
          </CenteredFlexBox>

          {/* list participants in this event*/}
          <Divider sx={{ m: 2 }} />

          <Typography>participants</Typography>
          <List dense>
            {participants?.map((participant) => (
              <ListItem key={participant.id}>
                <ListItemText primary={participant.name} />
              </ListItem>
            ))}
          </List>

          <CenteredFlexBox>
            {isOwner ? (
              <DeleteEventDialogButton
                event={eventData}
                buttonElement={(handleOpen) => (
                  <Button onClick={handleOpen} color={'error'}>
                    Delete Event
                  </Button>
                )}
              />
            ) : (
              <ParticipantLeaveEventDialogButton eventId={eventSnap.id} />
            )}
          </CenteredFlexBox>
        </Paper>
      ) : (
        <UserNotParticipating />
      )}
    </QueryIndicator>
  );
};

export default Event;
