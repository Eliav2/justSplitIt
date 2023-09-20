import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { addEvent } from '@/utils/firebase/firestore/queris/set';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, DialogContentText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FirestoreEvent } from '@/utils/firebase/firestore/schema';
import { useAsyncHandler } from '@/utils/hooks/useAsyncHandler';
import QueryButton from '@/components/Button/QueryButton';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';
import Box from '@mui/material/Box';
import { EventForm } from '@/pages/EventPage/EventForm';

export type IEventForm = Pick<FirestoreEvent, 'name' | 'description'>;

export const NewEventDialogButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const [createEventHandler, createLoading, createErrorMessage] = useAsyncHandler(
    async (data: IEventForm) => {
      return addEvent(data);
    },
    {
      onSuccess: async (eventRef, eventForm: UseFormReturn<IEventForm>) => {
        // console.log(eventRef.id);
        eventForm.reset();
        setOpen(false);
        if (eventRef.id) navigate(`/event/${eventRef.id}`);
      },
    },
  );

  return (
    <>
      <Box sx={{ pb: 2 }}>
        <Button variant="outlined" onClick={handleOpenDialog}>
          <English>Create new Event</English>
          <Hebrew>צור אירוע חדש</Hebrew>
        </Button>
      </Box>
      <Dialog open={open} onClose={handleCloseDialog} disableRestoreFocus>
        <EventForm
          errorMessage={createErrorMessage}
          renderFormContent={(formContent, eventForm) => {
            return (
              <form onSubmit={eventForm.handleSubmit(createEventHandler(eventForm))}>
                <DialogTitle>
                  <English>New Event</English>
                  <Hebrew>אירוע חדש</Hebrew>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <English>Provide a name for the new event.</English>
                    <Hebrew>בחר שם לאירוע שיווצר.</Hebrew>
                  </DialogContentText>
                  {formContent}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>
                    <>
                      <English>Cancel</English>
                      <Hebrew>בטל</Hebrew>
                    </>
                  </Button>
                  <QueryButton loading={createLoading} type={'submit'}>
                    <English>Create</English>
                    <Hebrew>צור</Hebrew>
                  </QueryButton>
                  {/*<Button type={'submit'}>{loadingState == 'idle' ? 'Create' : <Loading />}</Button>*/}
                </DialogActions>
              </form>
            );
          }}
        />
      </Dialog>
    </>
  );
};
