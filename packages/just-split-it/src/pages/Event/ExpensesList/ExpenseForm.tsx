import {
  FirestoreEventWithId,
  FirestoreExpense,
  FirestoreUser,
  FirestoreUserWithId,
} from '@/utils/firebase/firestore/schema';
import { User } from 'firebase/auth';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import Form from '@/components/Form/Form';
import { useEffect } from 'react';
import { QuerySnapshot } from 'firebase/firestore';
import { useGrabDocumentsByIds } from '@/utils/firebase/firestore/hooks/query';
import { firestore } from '@/utils/firebase/firestore/client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';

type ExpenseForm = Pick<FirestoreExpense, 'name'>;

export type ExpenseFormInput = ExpenseForm & {
  payer: FirestoreUserWithId;
  amount: string;
};

interface ExpenseFormProps {
  renderFormContent: (
    formContent: React.ReactNode,
    formHook: UseFormReturn<ExpenseFormInput>,
  ) => React.ReactNode;
  parentEvent: FirestoreEventWithId;
  defaultValues?: ExpenseFormInput;
}

export const ExpenseForm = ({
  renderFormContent,
  parentEvent,
  defaultValues,
}: ExpenseFormProps) => {
  const [user] = useAuthState(fbAuth);
  const [participants] = useGrabDocumentsByIds(firestore.user(), parentEvent?.participantsIds);
  const participantsDocs = participants?.docs ?? [];
  const participantsData = participantsDocs.map((p) => Object.assign({}, p.data(), { id: p.id }));

  const expenseForm = useForm<ExpenseFormInput>({
    defaultValues: defaultValues ?? {
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

  return (
    <Form renderFormContent={renderFormContent} formHook={expenseForm}>
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
    </Form>
  );

  // return renderFormContent(
  //   <>
  //     <Controller
  //       name={'name'}
  //       control={expenseForm.control}
  //       render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
  //         <TextField
  //           helperText={error ? error.message : null}
  //           error={!!error}
  //           size="small"
  //           onChange={onChange}
  //           value={value}
  //           fullWidth
  //           label={'Expense Name'}
  //           autoFocus
  //           margin="dense"
  //           type="text"
  //           variant="standard"
  //           required
  //         />
  //       )}
  //     />
  //     <Controller
  //       name={'amount'}
  //       control={expenseForm.control}
  //       render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
  //         <TextField
  //           helperText={error ? error.message : null}
  //           type="number"
  //           error={!!error}
  //           size="small"
  //           onChange={onChange}
  //           value={value}
  //           fullWidth
  //           label={'Amount'}
  //           InputProps={{
  //             startAdornment: <InputAdornment position="start">₪</InputAdornment>,
  //           }}
  //           autoFocus
  //           margin="dense"
  //           variant="standard"
  //           required
  //         />
  //       )}
  //     />
  //     <Controller
  //       name={'payer'}
  //       control={expenseForm.control}
  //       // defaultValue={undefined}
  //       rules={{
  //         validate: (value) => {
  //           return (
  //             participantsData.some((p) => p.id == value?.id) ||
  //             'Please select a valid option from the list.'
  //           );
  //         },
  //       }}
  //       render={({ field: { onChange, value }, fieldState: { error } }) => {
  //         return (
  //           <Autocomplete
  //             onChange={(event, value) => {
  //               onChange(value);
  //             }}
  //             value={value}
  //             getOptionLabel={(option) =>
  //               participantsData.find((p) => p.id == option.id)?.name || ''
  //             }
  //             isOptionEqualToValue={(option, value) => option.id == value.id}
  //             disablePortal
  //             options={participantsData}
  //             sx={{ width: 300 }}
  //             renderInput={(params) => (
  //               <TextField
  //                 {...params}
  //                 margin="dense"
  //                 label="Payed by"
  //                 variant="standard"
  //                 error={!!error}
  //                 helperText={error ? error.message : null}
  //                 required
  //               />
  //             )}
  //           />
  //         );
  //       }}
  //     />
  //   </>,
  //   expenseForm,
  // );
};
