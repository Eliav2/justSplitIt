import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { addExpense } from '@/utils/firebase/firestore/queris/queries';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, DialogContentText, FormHelperText } from '@mui/material';
import { FirestoreEventWithId } from '@/utils/firebase/firestore/schema';
import { useGrabDocumentsByIds } from '@/utils/firebase/firestore/hooks/query';
import { firestore } from '@/utils/firebase/firestore/client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import { grabDocumentById } from '@/utils/firebase/firestore/queris/util';
import { useAsyncHandler } from '@/utils/hooks/hooks';
import QueryButton from '@/components/Button/QueryButton';
import { ExpenseForm, ExpenseFormInput } from '@/pages/Event/ExpensesList/ExpenseForm';

interface NewExpenseDialogButtonProps {
  parentEvent: FirestoreEventWithId;
}

export const NewExpenseDialogButton = (props: NewExpenseDialogButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  // props.parentEvent.

  const [createExpenseHandler, createLoading, createErrorMessage] = useAsyncHandler(
    async (data: ExpenseFormInput) => {
      const [payer] = await grabDocumentById(firestore.user(), data.payer.id);
      await addExpense({
        amount: Number(data.amount),
        name: data.name,
        payerId: data.payer.id,
        payerName: payer!.name,
        parentEventId: props.parentEvent.id,
        //by default, all participants of an event would be added to an expense
        participantsIds: props.parentEvent.participantsIds,
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

  // Create an array to store document references
  // const docRefs = props.parentEvent?.participantsIds.map((id) => doc(firestore.user(), id));
  // const queryRef = query(firestore.user(), where('__name__', 'in', docRefs));

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create new Expense
      </Button>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>New Expense</DialogTitle>
        <ExpenseForm
          parentEvent={props.parentEvent}
          renderFormContent={(formContent, formHook) => {
            const handleCreateExpense = createExpenseHandler(formHook);
            return (
              <form onSubmit={formHook.handleSubmit(handleCreateExpense)}>
                <DialogContent>
                  <DialogContentText>Provide a name for the new expense.</DialogContentText>
                  {formContent}
                  {createErrorMessage && (
                    <FormHelperText error>{createErrorMessage}</FormHelperText>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <QueryButton type={'submit'} loading={createLoading}>
                    Create
                  </QueryButton>
                </DialogActions>
              </form>
            );
          }}
        />
        {/*<form onSubmit={expenseForm.handleSubmit(handleCreate)}>*/}
        {/*  <DialogContent>*/}
        {/*    <DialogContentText>Provide a name for the new expense.</DialogContentText>*/}

        {/*    <>*/}
        {/*      <Controller*/}
        {/*        name={'name'}*/}
        {/*        control={expenseForm.control}*/}
        {/*        render={({ field: { onChange, value }, fieldState: { error }, formState }) => (*/}
        {/*          <TextField*/}
        {/*            helperText={error ? error.message : null}*/}
        {/*            error={!!error}*/}
        {/*            size="small"*/}
        {/*            onChange={onChange}*/}
        {/*            value={value}*/}
        {/*            fullWidth*/}
        {/*            label={'Expense Name'}*/}
        {/*            autoFocus*/}
        {/*            margin="dense"*/}
        {/*            type="text"*/}
        {/*            variant="standard"*/}
        {/*            required*/}
        {/*          />*/}
        {/*        )}*/}
        {/*      />*/}
        {/*      <Controller*/}
        {/*        name={'amount'}*/}
        {/*        control={expenseForm.control}*/}
        {/*        render={({ field: { onChange, value }, fieldState: { error }, formState }) => (*/}
        {/*          <TextField*/}
        {/*            helperText={error ? error.message : null}*/}
        {/*            type="number"*/}
        {/*            error={!!error}*/}
        {/*            size="small"*/}
        {/*            onChange={onChange}*/}
        {/*            value={value}*/}
        {/*            fullWidth*/}
        {/*            label={'Amount'}*/}
        {/*            InputProps={{*/}
        {/*              startAdornment: <InputAdornment position="start">₪</InputAdornment>,*/}
        {/*            }}*/}
        {/*            autoFocus*/}
        {/*            margin="dense"*/}
        {/*            variant="standard"*/}
        {/*            required*/}
        {/*          />*/}
        {/*        )}*/}
        {/*      />*/}
        {/*      <Controller*/}
        {/*        name={'payer'}*/}
        {/*        control={expenseForm.control}*/}
        {/*        // defaultValue={undefined}*/}
        {/*        rules={{*/}
        {/*          validate: (value) => {*/}
        {/*            return (*/}
        {/*              participantsData.some((p) => p.id == value?.id) ||*/}
        {/*              'Please select a valid option from the list.'*/}
        {/*            );*/}
        {/*          },*/}
        {/*        }}*/}
        {/*        render={({ field: { onChange, value }, fieldState: { error } }) => {*/}
        {/*          return (*/}
        {/*            <Autocomplete*/}
        {/*              onChange={(event, value) => {*/}
        {/*                onChange(value);*/}
        {/*              }}*/}
        {/*              value={value}*/}
        {/*              getOptionLabel={(option) =>*/}
        {/*                participantsData.find((p) => p.id == option.id)?.name || ''*/}
        {/*              }*/}
        {/*              isOptionEqualToValue={(option, value) => option.id == value.id}*/}
        {/*              disablePortal*/}
        {/*              options={participantsData}*/}
        {/*              sx={{ width: 300 }}*/}
        {/*              renderInput={(params) => (*/}
        {/*                <TextField*/}
        {/*                  {...params}*/}
        {/*                  margin="dense"*/}
        {/*                  label="Payed by"*/}
        {/*                  variant="standard"*/}
        {/*                  error={!!error}*/}
        {/*                  helperText={error ? error.message : null}*/}
        {/*                  required*/}
        {/*                />*/}
        {/*              )}*/}
        {/*            />*/}
        {/*          );*/}
        {/*        }}*/}
        {/*      />*/}
        {/*      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}*/}
        {/*    </>*/}
        {/*  </DialogContent>*/}
        {/*  <DialogActions>*/}
        {/*    <Button onClick={handleCancel}>Cancel</Button>*/}
        {/*    <Button type={'submit'}>{loadingState == 'idle' ? 'Create' : <Loading />}</Button>*/}
        {/*  </DialogActions>*/}
        {/*</form>*/}
      </Dialog>
    </div>
  );
};
