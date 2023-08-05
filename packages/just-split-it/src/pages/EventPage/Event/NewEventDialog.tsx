import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { addEvent } from '@/utils/firebase/firestore/queris/set';
import { FirestoreError } from 'firebase/firestore';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, DialogContentText, FormHelperText, TextField } from '@mui/material';
import Loading from '@/components/Loading';
import { useNavigate } from 'react-router-dom';
import { FirestoreEvent } from '@/utils/firebase/firestore/schema';
import { useAsyncHandler } from '@/utils/hooks/useAsyncHandler';
import QueryButton from '@/components/Button/QueryButton';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';

export type IEventForm = Pick<FirestoreEvent, 'name' | 'description'>;

export const NewEventDialog = () => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingState, setLoadingState] = useState<'idle' | 'loading'>('idle');
  const navigate = useNavigate();

  const eventForm = useForm<IEventForm>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // const handleCreate = async (data: IEventForm) => {
  //   setLoadingState('loading');
  //   addEvent(data)
  //     .then((eventRef) => {
  //       setLoadingState('idle');
  //       setOpen(false);
  //       eventForm.reset();
  //       navigate(`/event/${eventRef.id}`);
  //     })
  //     .catch((e: FirestoreError) => {
  //       console.error(e);
  //       setLoadingState('idle');
  //       setErrorMessage(e.message);
  //     });
  // };

  const [createEventHandler, createLoading, createErrorMessage] = useAsyncHandler(
    async (data: IEventForm) => {
      return addEvent(data);
    },
    {
      onSuccess: async (eventRef) => {
        // console.log(eventRef.id);
        eventForm.reset();
        setOpen(false);
        if (eventRef.id) navigate(`/event/${eventRef.id}`);
      },
    },
  );
  // console.log();

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        <English>Create new Event</English>
        <Hebrew>צור אירוע חדש</Hebrew>
      </Button>
      <Dialog open={open} onClose={handleCancel} disableRestoreFocus>
        <form onSubmit={eventForm.handleSubmit(createEventHandler())}>
          <DialogTitle>New Event</DialogTitle>
          <DialogContent>
            <DialogContentText>Provide a name for the new event.</DialogContentText>
            <Controller
              name={'name'}
              control={eventForm.control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={!!error}
                  helperText={error ? error.message : null}
                  autoFocus
                  required
                  size="small"
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label={'Event name'}
                  margin="dense"
                  type="text"
                  variant="standard"
                />
              )}
            />
            <Controller
              name={'description'}
              control={eventForm.control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  size="small"
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label={'Description'}
                  margin="dense"
                  type="text"
                  variant="standard"
                  error={!!error}
                  helperText={error ? error.message : null}
                  multiline
                />
              )}
            />
            {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <QueryButton loading={createLoading} type={'submit'}>
              Create
            </QueryButton>
            {/*<Button type={'submit'}>{loadingState == 'idle' ? 'Create' : <Loading />}</Button>*/}
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
