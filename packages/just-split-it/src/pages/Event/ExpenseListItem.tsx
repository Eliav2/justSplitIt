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
import { updateDoc } from 'firebase/firestore';
import * as React from 'react';

interface ExpenseProps {
  expenseId: string;
}

export const ExpenseListItem = (props: ExpenseProps) => {
  const expense = useExpense(props.expenseId);
  const [user] = useAuthState(fbAuth);

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
        <ListItem
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
              primary={`${expense.data.name}`}
              secondary={`${expense.data.amount}₪`}
            />
          </ListItemButton>
        </ListItem>
      )}
    </QueryIndicator>
  );
};
