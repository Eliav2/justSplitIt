import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { addEvent } from '@/utils/firebase/firestore/queris/queries';
import { FirestoreError } from 'firebase/firestore';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, DialogContentText, TextField } from '@mui/material';
import Loading from '@/components/Loading';
import { useNavigate } from 'react-router-dom';

interface IEventForm {
  event: string;
}

export const NewEventDialog = () => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingState, setLoadingState] = useState<'idle' | 'loading'>('idle');
  const navigate = useNavigate();

  const eventForm = useForm<IEventForm>({
    defaultValues: {
      event: '',
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCreate = async (data: IEventForm) => {
    setLoadingState('loading');
    await addEvent(data.event)
      .then((eventRef) => {
        setLoadingState('idle');
        setOpen(false);
        eventForm.reset();
        navigate(`/event/${eventRef.id}`);
      })
      .catch((e: FirestoreError) => {
        console.error(e);
        setLoadingState('idle');
        setErrorMessage(e.message);
      });
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create new Event
      </Button>
      <Dialog open={open} onClose={handleCancel}>
        <form onSubmit={eventForm.handleSubmit(handleCreate)}>
          <DialogTitle>New Event</DialogTitle>
          <DialogContent>
            <DialogContentText>Provide a name for the new event.</DialogContentText>
            <Controller
              name={'event'}
              control={eventForm.control}
              render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
                <TextField
                  // helperText={error ? error.message : null}
                  // error={!!error}
                  required
                  size="small"
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label={'Event'}
                  autoFocus
                  margin="dense"
                  type="text"
                  variant="standard"
                  helperText={errorMessage}
                  error={errorMessage.length > 0}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type={'submit'}>{loadingState == 'idle' ? 'Create' : <Loading />}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
