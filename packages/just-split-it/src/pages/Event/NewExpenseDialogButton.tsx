import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { addExpense } from '@/utils/firebase/firestore/queris/queries';
import { doc, FirestoreError, query, where } from 'firebase/firestore';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {
  Autocomplete,
  DialogActions,
  DialogContentText,
  FormHelperText,
  InputAdornment,
  TextField,
} from '@mui/material';
import Loading from '@/components/Loading';
import {
  FirestoreEvent,
  FirestoreEventWithId,
  FirestoreExpense,
  FirestoreUser,
  FirestoreUserWithId,
} from '@/utils/firebase/firestore/schema';
import { useGetEvent } from '@/utils/firebase/firestore/queris/hooks';
import { useGrabDocumentsByIds } from '@/utils/firebase/firestore/hooks/query';
import { firestore } from '@/utils/firebase/firestore/client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import { grabDocumentById } from '@/utils/firebase/firestore/queris/util';
import { User } from '@firebase/auth';

type ExpenseForm = Pick<FirestoreExpense, 'name'>;

type ExpenseFormInput = ExpenseForm & {
  payer: FirestoreUserWithId;
  amount: string;
};

interface NewExpenseDialogButtonProps {
  parentEvent: FirestoreEventWithId;
}

export const NewExpenseDialogButton = (props: NewExpenseDialogButtonProps) => {
  const [user] = useAuthState(fbAuth);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingState, setLoadingState] = useState<'idle' | 'loading'>('idle');
  const [participants] = useGrabDocumentsByIds(
    firestore.user(),
    props.parentEvent?.participantsIds,
  );
  const participantsDocs = participants?.docs ?? [];
  const participantsData = participantsDocs.map((p) => Object.assign({}, p.data(), { id: p.id }));

  const expenseForm = useForm<ExpenseFormInput>({
    defaultValues: {
      name: '',
      amount: '0',
      payer: participantsData?.find((p) => p.id == user?.uid) || (null as any),
    },
  });

  // set the payer to the current user by default (only when the participants are loaded)
  useEffect(() => {
    expenseForm.setValue(
      'payer',
      participantsData?.find((p) => p.id == user?.uid) || (null as any),
    );
  }, [participants, open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  // props.parentEvent.

  const handleCreate = async (data: ExpenseFormInput) => {
    setLoadingState('loading');
    const [payer] = await grabDocumentById(firestore.user(), data.payer.id);
    await addExpense({
      amount: Number(data.amount),
      name: data.name,
      payerId: data.payer.id,
      payerName: payer!.name,
      parentEventId: props.parentEvent.id,

      //by default, all participants of an event would be added to an expense
      participantsIds: props.parentEvent.participantsIds,
    })
      .then(() => {
        setLoadingState('idle');
        setOpen(false);
        expenseForm.reset();
        setErrorMessage('');
      })
      .catch((e: FirestoreError) => {
        console.error(e);
        setLoadingState('idle');
        setErrorMessage(e.message);
      });
  };
  // Create an array to store document references
  // const docRefs = props.parentEvent?.participantsIds.map((id) => doc(firestore.user(), id));
  // const queryRef = query(firestore.user(), where('__name__', 'in', docRefs));

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create new Expense
      </Button>
      <Dialog open={open} onClose={handleCancel}>
        <ExpenseForm participantsData={participantsData} user={user} />
        {/*<form onSubmit={expenseForm.handleSubmit(handleCreate)}>*/}
        {/*  <DialogTitle>New Expense</DialogTitle>*/}
        {/*  <DialogContent>*/}
        {/*    <DialogContentText>Provide a name for the new expense.</DialogContentText>*/}
        {/*    <Controller*/}
        {/*      name={'name'}*/}
        {/*      control={expenseForm.control}*/}
        {/*      render={({ field: { onChange, value }, fieldState: { error }, formState }) => (*/}
        {/*        <TextField*/}
        {/*          helperText={error ? error.message : null}*/}
        {/*          error={!!error}*/}
        {/*          size="small"*/}
        {/*          onChange={onChange}*/}
        {/*          value={value}*/}
        {/*          fullWidth*/}
        {/*          label={'Expense Name'}*/}
        {/*          autoFocus*/}
        {/*          margin="dense"*/}
        {/*          type="text"*/}
        {/*          variant="standard"*/}
        {/*          required*/}
        {/*        />*/}
        {/*      )}*/}
        {/*    />*/}
        {/*    <Controller*/}
        {/*      name={'amount'}*/}
        {/*      control={expenseForm.control}*/}
        {/*      render={({ field: { onChange, value }, fieldState: { error }, formState }) => (*/}
        {/*        <TextField*/}
        {/*          helperText={error ? error.message : null}*/}
        {/*          type="number"*/}
        {/*          error={!!error}*/}
        {/*          size="small"*/}
        {/*          onChange={onChange}*/}
        {/*          value={value}*/}
        {/*          fullWidth*/}
        {/*          label={'Amount'}*/}
        {/*          InputProps={{*/}
        {/*            startAdornment: <InputAdornment position="start">₪</InputAdornment>,*/}
        {/*          }}*/}
        {/*          autoFocus*/}
        {/*          margin="dense"*/}
        {/*          variant="standard"*/}
        {/*          required*/}
        {/*        />*/}
        {/*      )}*/}
        {/*    />*/}
        {/*    <Controller*/}
        {/*      name={'payer'}*/}
        {/*      control={expenseForm.control}*/}
        {/*      // defaultValue={undefined}*/}
        {/*      rules={{*/}
        {/*        validate: (value) => {*/}
        {/*          return (*/}
        {/*            participantsData.some((p) => p.id == value?.id) ||*/}
        {/*            'Please select a valid option from the list.'*/}
        {/*          );*/}
        {/*        },*/}
        {/*      }}*/}
        {/*      render={({ field: { onChange, value }, fieldState: { error } }) => {*/}
        {/*        return (*/}
        {/*          <Autocomplete*/}
        {/*            onChange={(event, value) => {*/}
        {/*              onChange(value);*/}
        {/*            }}*/}
        {/*            value={value}*/}
        {/*            getOptionLabel={(option) =>*/}
        {/*              participantsData.find((p) => p.id == option.id)?.name || ''*/}
        {/*            }*/}
        {/*            isOptionEqualToValue={(option, value) => option.id == value.id}*/}
        {/*            disablePortal*/}
        {/*            options={participantsData}*/}
        {/*            sx={{ width: 300 }}*/}
        {/*            renderInput={(params) => (*/}
        {/*              <TextField*/}
        {/*                {...params}*/}
        {/*                margin="dense"*/}
        {/*                label="Payed by"*/}
        {/*                variant="standard"*/}
        {/*                error={!!error}*/}
        {/*                helperText={error ? error.message : null}*/}
        {/*                required*/}
        {/*              />*/}
        {/*            )}*/}
        {/*          />*/}
        {/*        );*/}
        {/*      }}*/}
        {/*    />*/}
        {/*    {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}*/}
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

interface ExpenseFormProps {}

interface ExpenseFormProps {
  participantsData: FirestoreUserWithId[];
  user: User | null | undefined;
  errorMessage?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

const ExpenseForm = ({ participantsData, user, errorMessage, onSubmit }: ExpenseFormProps) => {
  // const [errorMessage, setErrorMessage] = useState('');
  // const [loadingState, setLoadingState] = useState<'idle' | 'loading'>('idle');

  const expenseForm = useForm<ExpenseFormInput>({
    defaultValues: {
      name: '',
      amount: '0',
      payer: participantsData?.find((p) => p.id == user?.uid) || (null as any),
    },
  });

  return (
    <form onSubmit={onSubmit}>
      <Controller
        name={'name'}
        control={expenseForm.control}
        render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
          <TextField
            helperText={error ? error.message : null}
            error={!!error}
            size="small"
            onChange={onChange}
            value={value}
            fullWidth
            label={'Expense Name'}
            autoFocus
            margin="dense"
            type="text"
            variant="standard"
            required
          />
        )}
      />
      <Controller
        name={'amount'}
        control={expenseForm.control}
        render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
          <TextField
            helperText={error ? error.message : null}
            type="number"
            error={!!error}
            size="small"
            onChange={onChange}
            value={value}
            fullWidth
            label={'Amount'}
            InputProps={{
              startAdornment: <InputAdornment position="start">₪</InputAdornment>,
            }}
            autoFocus
            margin="dense"
            variant="standard"
            required
          />
        )}
      />
      <Controller
        name={'payer'}
        control={expenseForm.control}
        // defaultValue={undefined}
        rules={{
          validate: (value) => {
            return (
              participantsData.some((p) => p.id == value?.id) ||
              'Please select a valid option from the list.'
            );
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <Autocomplete
              onChange={(event, value) => {
                onChange(value);
              }}
              value={value}
              getOptionLabel={(option) =>
                participantsData.find((p) => p.id == option.id)?.name || ''
              }
              isOptionEqualToValue={(option, value) => option.id == value.id}
              disablePortal
              options={participantsData}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label="Payed by"
                  variant="standard"
                  error={!!error}
                  helperText={error ? error.message : null}
                  required
                />
              )}
            />
          );
        }}
      />
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </form>
  );
};
