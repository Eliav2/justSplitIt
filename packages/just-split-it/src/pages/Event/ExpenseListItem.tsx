import { useExpense } from '@/utils/firebase/firestore/queris/hooks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import QueryIndicator from '@/components/QueryIndicator';
import ListItem, { ListItemProps } from '@mui/material/ListItem';
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import ConfirmDeleteDialogButton from '@/components/Dialog/ConfirmDeleteDialogButton';
import { deleteExpense } from '@/utils/firebase/firestore/queris/queries';
import { DocumentReference, updateDoc } from 'firebase/firestore';
import * as React from 'react';
import { BaseSyntheticEvent, useState } from 'react';
import Typography from '@mui/material/Typography';
import { FirestoreEvent, FirestoreExpense } from '@/utils/firebase/firestore/schema';
import { Chip, DialogActions, DialogContentText, FormHelperText } from '@mui/material';
import { useAsyncHandler } from '@/utils/hooks/hooks';
import { ExpenseForm, ExpenseFormInput } from '@/pages/Event/ExpenseForm';
import { firestore } from '@/utils/firebase/firestore/client';
import { UseFormReturn } from 'react-hook-form';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import QueryButton from '@/components/Button/QueryButton';
import { useGrabDocumentDataById } from '@/utils/firebase/firestore/hooks/query';

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

interface EditExpenseDialogListItemButtonProps extends ListItemButtonProps {
  expense: FirestoreExpense;
  expenseRef: DocumentReference<FirestoreExpense>;
  parentEvent: FirestoreEvent & { id: string };
}

export const EditExpenseDialogListItemButton = ({
  expense,
  parentEvent,
  expenseRef,
  ...props
}: EditExpenseDialogListItemButtonProps) => {
  const [open, setOpen] = useState(false);

  const [payer, loadingPayer, errorPayer] = useGrabDocumentDataById(
    firestore.user(),
    expense.payerId,
  );

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCancel = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    setOpen(false);
  };

  const [createExpenseHandler, createLoading, createErrorMessage] = useAsyncHandler(
    async (data: ExpenseFormInput) => {
      updateDoc(expenseRef, {
        amount: Number(data.amount),
        name: data.name,
        payerId: data.payer.id,
        payerName: payer!.name,
      });
    },

    {
      onSuccess: (asd, formHook: UseFormReturn<ExpenseFormInput>) => {
        setOpen(false);
        formHook.reset();
      },
      onError: (e) => {
        console.error(e);
      },
    },
  );

  return (
    <ListItemButton {...props} onClick={handleClickOpen}>
      {props.children}
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Edit Expense</DialogTitle>
        <QueryIndicator loading={loadingPayer} errorMessage={errorPayer?.message}>
          {payer && (
            <ExpenseForm
              defaultValues={{
                name: expense.name,
                amount: expense.amount.toString(),
                payer: payer,
              }}
              parentEvent={parentEvent}
              renderFormContent={(formContent, formHook) => {
                const handleCreateExpense = createExpenseHandler(formHook);
                return (
                  <form onSubmit={formHook.handleSubmit(handleCreateExpense)}>
                    <DialogContent>
                      <DialogContentText>Hit Update after edits</DialogContentText>
                      {formContent}
                      {createErrorMessage && (
                        <FormHelperText error>{createErrorMessage}</FormHelperText>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCancel}>Cancel</Button>
                      <QueryButton type={'submit'} loading={createLoading}>
                        Update
                      </QueryButton>
                    </DialogActions>
                  </form>
                );
              }}
            />
          )}
        </QueryIndicator>
      </Dialog>
    </ListItemButton>
  );
};
