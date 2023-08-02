import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';
import { FirestoreEvent, FirestoreExpense } from '@/utils/firebase/firestore/schema';
import { DocumentReference, updateDoc } from 'firebase/firestore';
import * as React from 'react';
import { BaseSyntheticEvent, useState } from 'react';
import { useGrabDocumentDataById } from '@/utils/firebase/firestore/hooks/query';
import { firestore } from '@/utils/firebase/firestore/client';
import { useAsyncHandler } from '@/utils/hooks/hooks';
import { ExpenseForm, ExpenseFormInput } from '@/pages/Event/ExpensesList/ExpenseForm';
import { UseFormReturn } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import QueryIndicator from '@/components/QueryIndicator';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, FormHelperText } from '@mui/material';
import Button from '@mui/material/Button';
import QueryButton from '@/components/Button/QueryButton';
import { ExpenseParticipantsDetails } from '@/pages/Event/ExpensesList/ExpenseListItem/ExpenseParticipantsDetails/ExpenseParticipantsDetails';

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
  // console.log(participantsInExpense);

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
                      {formContent}
                      {createErrorMessage && (
                        <FormHelperText error>{createErrorMessage}</FormHelperText>
                      )}
                    </DialogContent>
                    <ExpenseParticipantsDetails expense={expense} />

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
