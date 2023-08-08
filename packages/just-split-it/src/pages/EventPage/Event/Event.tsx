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
import Box from '@mui/material/Box';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import EventGraph from '@/classes/EventGraph';

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
  const participantsData = participants ?? [];
  const isOwner = user?.uid === eventData?.ownerId;

  const [expenses, loading, error] = useGetEventExpenses(eventSnap.id as string, [
    isUserParticipating,
  ]);

  // const expensesData = expenses?.docs.map((expense) => expense.data()) ?? [];
  const eventTotalExpense = sumArray(expenses?.map((expense) => expense.amount) ?? []);

  const userPayedFor = round(
    expenses?.reduce((acc, expense) => {
      if (expense.payerId === user?.uid) {
        return acc + expense.amount;
      }
      return acc;
    }, 0) ?? 0,
  );

  const userDebts =
    ((user &&
      expenses
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
  // console.log(userDebts);

  const eventGraph = new EventGraph(participants, expenses);
  // console.log(eventGraph);
  // console.log();

  let eventsDebts: Debt[] = eventGraph.allDebts.map((debt) => {
    return {
      expenseName: debt.expense.name,
      amount: debt.amount,
      participantName: debt.owedBy.user.name,
      oweTo: debt.oweTo.user.name,
      simplified: false,
    };
  });

  const simplifiedDebts = eventGraph.getSimplifiedDebts();
  eventsDebts = simplifiedDebts.map((debt) => {
    return {
      expenseName: debt.expense.name,
      amount: debt.amount,
      participantName: debt.owedBy.user.name,
      oweTo: debt.oweTo.user.name,
      simplified: debt.simplified,
    };
  });
  console.log(eventGraph);
  console.log(simplifiedDebts);

  // const eventsDebts = [];
  // for (const expense of expenses) {
  //   for (const participant of participantsData) {
  //     if (expense.payerId === participant.id) {
  //       continue;
  //     }
  //     if (expense.participantsIds.includes(participant.id)) {
  //       const debt = {
  //         expenseName: expense.name,
  //         amount: expense.amount / expense.participantsIds.length,
  //         participantName: participant.name,
  //         oweTo: expense.payerName,
  //         simplified: false,
  //       } satisfies Debt;
  //       eventsDebts.push(debt);
  //     }
  //   }
  //   // console.log(userExpenses
  // }

  // console.log(eventsDebts);

  // const owedColor = '#1ECC00';
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
            {expenses && (expenses.length ?? 0) > 0 ? (
              <QueryIndicator loading={loading} errorMessage={error?.message}>
                {expenses.map((expene, expenseIndex) => {
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
              <CenteredFlexBox>
                <ListItemText>
                  {userBalance > 0 ? (
                    <Box sx={{ color: 'primary.owedColor' }}>
                      <Typography>
                        <English>You are owed: </English>
                        <Hebrew>חייבים לך:</Hebrew>
                      </Typography>
                      <Typography variant={'h5'} sx={{ fontWeight: 'bold' }}>
                        {userBalance}₪
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ color: 'primary.ownColor' }}>
                      <Typography>
                        <English>You owe:</English>
                        <Hebrew>אתה חייב:</Hebrew>
                      </Typography>
                      <Typography variant={'h5'} sx={{ fontWeight: 'bold' }}>
                        {userBalance * -1}₪
                      </Typography>
                    </Box>
                  )}
                </ListItemText>
              </CenteredFlexBox>
            </ListItem>
          </List>

          <Typography>
            <English>Users Debts</English>
            <Hebrew>חובות האירוע</Hebrew>
          </Typography>
          <List>
            {eventsDebts.map((debt) => {
              return (
                <ListItem key={debt.participantName + debt.oweTo + debt.expenseName}>
                  <ListItemText>
                    <Typography
                      variant={'body1'}
                      sx={{ display: 'inline', color: 'primary.main', fontWeight: 'medium' }}
                    >
                      {debt.participantName}
                    </Typography>{' '}
                    {/*<ArrowRightAltIcon />*/}
                    <Typography sx={{ display: 'inline', fontStyle: 'italic' }} variant={'body2'}>
                      <English>owe </English>
                      <Hebrew>חייב ל</Hebrew>
                      {/*->*/}
                    </Typography>
                    <Typography
                      sx={{ display: 'inline', color: 'primary.main', fontWeight: 'medium' }}
                    >
                      {debt.oweTo}
                    </Typography>
                    :{' '}
                    <Typography
                      sx={{ display: 'inline', fontWeight: 'bold', color: 'primary.ownColor' }}
                    >
                      {debt.amount}₪
                    </Typography>{' '}
                    <Typography sx={{ display: 'inline', fontStyle: 'italic' }} variant={'body2'}>
                      <English>for</English>
                      <Hebrew>עבור</Hebrew>
                    </Typography>{' '}
                    {debt.expenseName}
                  </ListItemText>
                </ListItem>
              );
            })}
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

export type Debt = {
  amount: number;
  oweTo: string;
  participantName: string;
  expenseName: string;
  simplified: false | [Debt, Debt];
};

// const mergeSameDebts = (debts: Debt[]) => {
//   const mergedDebts: Debt[] = [];
//   for (const debt of debts) {
//     const existingDebt = mergedDebts.find(
//       (d) => d.participantName === debt.participantName && d.oweTo === debt.oweTo,
//     );
//     if (existingDebt) {
//       existingDebt.amount += debt.amount;
//     } else {
//       mergedDebts.push(debt);
//     }
//   }
//   return mergedDebts;
// };

// const simplifyDebts = (debts: Debt[]) => {
//   const simplifiedDebts: Debt[] = structuredClone(simplifyDebts);
//   let i = 0;
//   while (i < debts.length) {
//     const currentDebt = debts[i];
//     const deductions = debts.filter((d) => d.participantName === currentDebt.oweTo);
//     if (deductions.length > 0) {
//       // for
//     }
//   }
//   // for (const debt of debts) {
//   //   const existingDebt = simplifiedDebts.find(
//   //     (d) => d.participantName === debt.participantName && d.oweTo === debt.oweTo,
//   //   );
//   //   if (existingDebt) {
//   //     existingDebt.amount += debt.amount;
//   //   } else {
//   //     simplifiedDebts.push(debt);
//   //   }
//   // }
// };

export default Event;
