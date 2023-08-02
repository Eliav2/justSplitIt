import { useExpense } from '@/utils/firebase/firestore/queris/hooks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import QueryIndicator from '@/components/QueryIndicator';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import ConfirmDeleteDialogButton from '@/components/Dialog/ConfirmDeleteDialogButton';
import { deleteExpense } from '@/utils/firebase/firestore/queris/queries';
import { DocumentSnapshot, updateDoc } from 'firebase/firestore';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import ExpensesDetailsProps from '@/pages/Event/ExpensesDetails/ExpensesDetails';
import { FirestoreEvent } from '@/utils/firebase/firestore/schema';
import { AppTheme } from '@/theme/themes';
import { Chip } from '@mui/material';

interface ExpenseProps {
  expenseId: string;
  eventData: FirestoreEvent & { id: string };
}

interface Theme {
  userOwnExpenseColor: string;
}

export const ExpenseListItem = (props: ExpenseProps) => {
  const expense = useExpense(props.expenseId);
  const [user] = useAuthState(fbAuth);
  const isOwner = user?.uid === expense.data?.payerId;

  function handleToggle(name: string) {
    return undefined;
  }

  const includedInExpense = expense.data?.participantsIds.includes(user!.uid);

  const handleCheckToggle = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (!expense.ref || !expense.data) return;
    if (checked) {
      await updateDoc(expense.ref, {
        participantsIds: [...expense.data.participantsIds, user!.uid],
      });
    } else {
      await updateDoc(expense.ref, {
        participantsIds: expense.data.participantsIds.filter((id) => id !== user!.uid),
      });
    }
  };

  return (
    <QueryIndicator loading={expense.loading}>
      {expense.data && (
        <>
          <ListItem
            // sx={
            //   isOwner
            //     ? (theme: any) => {
            //         return { background: theme.userOwnExpenseColor };
            //       }
            //     : {}
            // }
            key={expense.data?.id}
            secondaryAction={
              <ConfirmDeleteDialogButton
                handleConfirm={async (close) => {
                  await deleteExpense(expense.data!.id);
                  close();
                }}
              />
            }
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(expense.data.name)} dense>
              <ListItemIcon>
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
                id={expense.data.id}
                primary={
                  <>
                    {expense.data.name}

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
                    {expense.data.amount}₪{' '}
                    <Typography
                      variant={'caption'}
                      color="textSecondary"
                      sx={{ fontSize: '0.8em' }}
                    >
                      payed by
                    </Typography>{' '}
                    {expense.data.payerName}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </>
      )}
    </QueryIndicator>
  );
};
