import { useExpense } from '@/utils/firebase/firestore/queris/hooks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import QueryIndicator from '@/components/QueryIndicator';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import ConfirmDeleteDialogButton from '@/pages/Event/ExpensesList/ExpenseListItem/ConfirmDeleteDialogButton';
import { deleteExpense } from '@/utils/firebase/firestore/queris/queries';
import { updateDoc } from 'firebase/firestore';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { FirestoreEvent } from '@/utils/firebase/firestore/schema';
import { Chip } from '@mui/material';
import { EditExpenseDialogListItemButton } from '@/pages/Event/ExpensesList/ExpenseListItem/EditExpenseDialogListItemButton';

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
      await updateDoc(expenseSnap?.ref, {
        participantsIds: [...expense?.participantsIds, user!.uid],
      });
    } else {
      await updateDoc(expenseSnap?.ref, {
        participantsIds: expense?.participantsIds.filter((id) => id !== user!.uid),
      });
    }
  };

  return (
    <QueryIndicator loading={expenseLoading}>
      {expense && expenseSnap && (
        <>
          <ListItem
            key={expense.id}
            secondaryAction={
              <ConfirmDeleteDialogButton
                handleConfirm={async (close) => {
                  await deleteExpense(expense.id);
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
                <Checkbox
                  edge="start"
                  // checked={checked[expense.name]?.selected}
                  checked={includedInExpense}
                  onChange={handleCheckToggle}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                id={expense?.id}
                primary={
                  <>
                    {expense?.name}

                    {isOwner && (
                      <Chip
                        sx={{ mx: 1 }}
                        label="yours"
                        variant="outlined"
                        color="primary"
                        size={'small'}
                      />
                    )}
                  </>
                }
                secondary={
                  <Typography variant={'body2'} color="textSecondary">
                    {expense?.amount}₪{' '}
                    <Typography
                      variant={'caption'}
                      color="textSecondary"
                      sx={{ fontSize: '0.8em' }}
                    >
                      payed by
                    </Typography>{' '}
                    {expense?.payerName}
                  </Typography>
                }
              />
            </EditExpenseDialogListItemButton>
          </ListItem>
        </>
      )}
    </QueryIndicator>
  );
};
