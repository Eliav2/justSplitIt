import { useExpense } from '@/utils/firebase/firestore/queris/get';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import QueryIndicator from '@/components/QueryIndicator';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import ConfirmDeleteDialogButton from '@/pages/EventPage/Event/ExpenseListItem/ConfirmDeleteDialogButton';
import { deleteExpense } from '@/utils/firebase/firestore/queris/set';
import { updateDoc } from 'firebase/firestore';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { FirestoreEvent } from '@/utils/firebase/firestore/schema';
import { Chip } from '@mui/material';
import { EditExpenseDialogListItemButton } from '@/pages/EventPage/Event/ExpenseListItem/ExpenseParticipantsDetails/EditExpenseDialogListItemButton';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

interface ExpenseProps {
  expenseId: string;
  eventData: FirestoreEvent & { id: string };
}

interface Theme {
  userOwnExpenseColor: string;
}

export const ExpenseListItem = (props: ExpenseProps) => {
  const [expense, expenseLoading, expenseError, expenseSnap] = useExpense(props.expenseId);
  const [user] = useAuthState(fbAuth);
  const isOwner = user?.uid === expense?.payerId;

  function handleToggle(name: string) {
    return undefined;
  }

  // console.log(expense);
  const includedInExpense = expense?.participantsIds?.includes(user!.uid);

  const handleCheckToggle = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (!expenseSnap?.ref || !expense) return;

    if (checked) {
      updateDoc(expenseSnap?.ref, {
        participantsIds: [...expense?.participantsIds, user!.uid],
      });
    } else {
      updateDoc(expenseSnap?.ref, {
        participantsIds: expense?.participantsIds.filter((id) => id !== user!.uid),
      });
    }
  };
  // const userOweForExpense =
  //   (expense &&
  //     user &&
  //     (expense?.participantsIds?.includes(user?.uid)
  //       ? expense?.amount / expense.participantsIds.length
  //       : 0 + expense.payerId == user.uid
  //       ? expense.amount
  //       : 0)) ??
  //   0;
  let userOweForExpense = 0;
  if (expense && user) {
    if (expense.participantsIds?.includes(user.uid)) {
      userOweForExpense += expense.amount / expense.participantsIds.length;
    }
    if (expense.payerId == user.uid) {
      userOweForExpense -= expense.amount;
    }
  }

  return (
    <QueryIndicator loading={expenseLoading}>
      {expense && expenseSnap && (
        <>
          <ListItem
            key={expense.id}
            secondaryAction={
              <ConfirmDeleteDialogButton
                handleConfirm={async (close) => {
                  deleteExpense(expense.id);
                  close();
                }}
              />
            }
            disablePadding
          >
            <EditExpenseDialogListItemButton
              expense={expense}
              expenseRef={expenseSnap.ref}
              parentEvent={props.eventData}
              role={undefined}
              onClick={handleToggle(expense?.name)}
              dense
            >
              <ListItemIcon
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Tooltip
                  title={
                    <>
                      <English>Do you participates in this expense?</English>
                      <Hebrew>האם אתה משתתף בהוצאה זו?</Hebrew>
                    </>
                  }
                >
                  <Checkbox
                    edge="start"
                    // checked={checked[expense.name]?.selected}
                    checked={includedInExpense}
                    onChange={handleCheckToggle}
                    tabIndex={-1}
                    disableRipple
                  />
                </Tooltip>
              </ListItemIcon>
              <Box>
                <ListItemText
                  sx={{ mb: 0 }}
                  id={expense?.id}
                  primary={
                    <>
                      {expense?.name}

                      {isOwner && (
                        <Chip
                          sx={{ mx: 1 }}
                          label={
                            <>
                              <English>yours</English>
                              <Hebrew>שלך</Hebrew>
                            </>
                          }
                          variant="outlined"
                          color="primary"
                          size={'small'}
                        />
                      )}
                    </>
                  }
                />
                <>
                  <Typography variant={'caption'} color="textSecondary" sx={{ fontSize: '0.8em' }}>
                    {expense?.amount}₪ <English>payed by</English> <Hebrew>שולם ע"י</Hebrew>{' '}
                    {expense?.payerName}
                  </Typography>{' '}
                  {userOweForExpense != 0 ? (
                    <Typography
                      // color={'#6f3675'} //
                      color={userOweForExpense > 0 ? 'primary.ownColor' : 'primary.owedColor'}
                      variant={'subtitle2'}
                      sx={{ fontSize: '0.8em' }}
                    >
                      <English>
                        {userOweForExpense > 0 ? 'You owe ' : 'You are owed '}
                        {Math.abs(userOweForExpense)}₪ for this expense
                      </English>
                      <Hebrew>
                        {userOweForExpense > 0 ? 'אתה חייב ' : 'חייבים לך '}
                        {Math.abs(userOweForExpense)}₪ עבור הוצאה זו
                      </Hebrew>
                    </Typography>
                  ) : null}
                </>
              </Box>
            </EditExpenseDialogListItemButton>
          </ListItem>
        </>
      )}
    </QueryIndicator>
  );
};
