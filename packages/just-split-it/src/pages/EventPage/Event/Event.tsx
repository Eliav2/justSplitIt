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
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';

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

  const userDebts =
    ((user &&
      expensesData
        ?.map((expense) => {
          if (!expense.participantsIds.includes(user?.uid)) return null;
          return {
            expenseName: expense.name,
            amount: expense.amount / expense.participantsIds.length,
            oweTo: expense.payerName,
          };
        }, 0)
        .filter((e) => e)) as { expenseName: string; amount: number; oweTo: string }[]) ?? [];

  const userTotalExpense = round(sumArray(userDebts.map((expense) => expense.amount)));

  const userBalance = round(userPayedFor - userTotalExpense);
  const eventOwner = participants?.find((p) => p.id == eventData.ownerId);

  // const userDebts =
  console.log(userDebts);

  // console.log(userExpenses);

  // const owedColor = '#1ECC00';
  const ownColor = '#CC8900';
  return (
    <QueryIndicator loading={loadingUser}>
      <Typography variant="h2" sx={{ m: 1, mb: 2, textAlign: 'center' }}>
        {eventData?.name}
      </Typography>

      {isUserParticipating ? (
        <Paper
          sx={{
            p: 2,
            // minWidth: '60%',
          }}
        >
          <Typography>
            <English>Expenses</English>
            <Hebrew>הוצאות</Hebrew>
          </Typography>

          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {(expenses?.docs.length ?? 0) > 0 ? (
              <QueryIndicator loading={loading} errorMessage={error?.message}>
                {expenses?.docs.map((expene, expenseIndex) => {
                  return (
                    <ExpenseListItem eventData={eventData} expenseId={expene.id} key={expene.id} />
                  );
                })}
              </QueryIndicator>
            ) : (
              <ListItem>
                <ListItemText>
                  <Typography variant={'caption'} color={'textSecondary'}>
                    <English>No Expenses in this Event</English>
                    <Hebrew>אין עדיין הוצאות באירוע זה </Hebrew>
                  </Typography>
                </ListItemText>
              </ListItem>
            )}
          </List>
          <List dense>
            <ListItem>
              <ListItemText sx={{}}>
                <English>Total Expenses: {eventTotalExpense}₪</English>
                <Hebrew>סך ההוצאות: {eventTotalExpense}₪</Hebrew>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText sx={{}}>
                <English>You Should Pay back: {userTotalExpense}₪</English>
                <Hebrew>עליך להחזיר: {userTotalExpense}₪</Hebrew>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText sx={{}}>
                <English>You Paid for: {userPayedFor}₪</English>
                <Hebrew>סך ההוצאות שלך: {userPayedFor}₪</Hebrew>
              </ListItemText>
            </ListItem>
            <ListItem>
              <CenteredFlexBox>
                <ListItemText>
                  {userBalance > 0 ? (
                    <Typography sx={{ color: 'primary.owedColor' }}>
                      <English>You are owed: </English>
                      <Hebrew>חייבים לך:</Hebrew>
                      <Typography variant={'h5'} sx={{ fontWeight: 'bold' }}>
                        {userBalance}₪
                      </Typography>
                    </Typography>
                  ) : (
                    <Typography sx={{ color: 'primary.ownColor' }}>
                      <English>You owe:</English>
                      <Hebrew>אתה חייב:</Hebrew>
                      <Typography variant={'h5'} sx={{ fontWeight: 'bold' }}>
                        {userBalance * -1}₪
                      </Typography>
                    </Typography>
                  )}
                </ListItemText>
              </CenteredFlexBox>
            </ListItem>
          </List>

          <CenteredFlexBox>
            <NewExpenseDialogButton parentEvent={eventData} />
          </CenteredFlexBox>

          {/* list participants in this event*/}
          <Divider sx={{ m: 2 }} />

          <Typography>
            <English>Participants</English>
            <Hebrew>משתתפים באירוע</Hebrew>
          </Typography>
          <List dense>
            {participants?.map((participant) => (
              <ListItem key={participant.id}>
                <ListItemText primary={participant.name} />
              </ListItem>
            ))}
          </List>
          {eventOwner && (
            <>
              <Typography variant={'body2'} color={'textSecondary'}>
                <English>event created by</English>
                <Hebrew>האירוע נוצר ע"י</Hebrew>
              </Typography>
              <Typography>{eventOwner?.name}</Typography>
            </>
          )}

          <CenteredFlexBox>
            {isOwner ? (
              <DeleteEventDialogButton
                event={eventData}
                buttonElement={(handleOpen) => (
                  <Button onClick={handleOpen} color={'error'}>
                    <English>Delete Event</English>
                    <Hebrew>מחק אירוע</Hebrew>
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
