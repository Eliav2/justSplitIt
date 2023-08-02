import { DocumentSnapshot } from 'firebase/firestore';
import { FirestoreEvent } from '@/utils/firebase/firestore/schema';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import { useGetEventExpenses, useParticipantsByIds } from '@/utils/firebase/firestore/queris/hooks';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import QueryIndicator from '@/components/QueryIndicator';
import { ExpenseListItem } from '@/pages/Event/ExpenseListItem';
import { NewExpenseDialogButton } from '@/pages/Event/NewExpenseDialogButton';
import { DeleteEventDialogButton } from '@/components/Dialog/DeleteEventDialogButton';
import Button from '@mui/material/Button';
import ParticipantLeaveEventDialogButton from '@/components/Dialog/ParticipantLeaveEventDialogButton';
import { round, sumArray } from '@/utils/math';
import { useRerender } from '@/utils/hooks/hooks';
import { useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';

interface ExpensesDetailsProps {
  event: DocumentSnapshot<FirestoreEvent>;
}

const ExpensesDetails = ({ event }: ExpensesDetailsProps) => {
  const [user, loadingUser] = useAuthState(fbAuth);
  const eventData = event && Object.assign({}, event.data(), { id: event.id });
  const isUserParticipating = user && eventData?.participantsIds?.includes(user?.uid);
  // console.log('number of participants', eventData.participantsIds.length);
  const isOwner = user?.uid === eventData?.ownerId;

  const [expenses, loading, error] = useGetEventExpenses(event.id as string, [isUserParticipating]);
  const [participants, loadingParticipants, errorParticipants] = useParticipantsByIds(
    eventData.participantsIds,
  );

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

  // const rerender = useRerender();
  // useEffect(() => {
  //   rerender();
  // }, [isUserParticipating]);

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
        <>
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

          <NewExpenseDialogButton parentEvent={eventData} />

          {/* list participants in this event*/}
          <Paper sx={{ p: 2, m: 3 }}>
            <Typography variant={'h3'}>participants</Typography>
            <List>
              {participants?.map((participant) => (
                <ListItem key={participant.id}>
                  <ListItemText primary={participant.name} />
                </ListItem>
              ))}
            </List>
          </Paper>

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
            <ParticipantLeaveEventDialogButton eventId={event.id} />
          )}
        </>
      ) : (
        <UserNotParticipating />
      )}
    </QueryIndicator>
  );
};

const UserNotParticipating = () => {
  return (
    <>
      <Typography variant={'body1'}>You are not participating in this event</Typography>
    </>
  );
};

interface ExpenseEditDialogButtonProps {}
const ExpenseEditDialogButton = (props: ExpenseEditDialogButtonProps) => {
  return <div></div>;
};

export default ExpensesDetails;
