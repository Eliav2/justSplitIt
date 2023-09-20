import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { addEvent, editEvent } from '@/utils/firebase/firestore/queris/set';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, DialogContentText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FirestoreEvent, FirestoreEventWithId } from '@/utils/firebase/firestore/schema';
import { useAsyncHandler } from '@/utils/hooks/useAsyncHandler';
import QueryButton from '@/components/Button/QueryButton';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';
import Box from '@mui/material/Box';
import { ColumnFlexBox } from '@/components/styled';
import useSidebar from '@/store/sidebar';
import { EventForm } from '@/pages/EventPage/EventForm';
import { IEventForm } from '@/pages/EventPage/NewEventDialogButton';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DialogButton from '@/components/Dialog/DialogButton';

interface EditEventDialogButtonProps {
  event: FirestoreEventWithId;
}

export const EditEventDialogButton: React.FC<EditEventDialogButtonProps> = ({ event }) => {
  return (
    <>
      <DialogButton
        buttonElement={(handleOpen) => (
          <IconButton aria-label="edit" onClick={handleOpen}>
            <EditIcon />
          </IconButton>
        )}
        dialogContent={(handleClose) => {
          const [editEventHandler, editLoading, editErrorMessage] = useAsyncHandler(
            async (data: IEventForm) => {
              return editEvent(event.id, data);
            },
            {
              onSuccess: async (_, eventForm: UseFormReturn<IEventForm>) => {
                eventForm.reset();
                handleClose();
              },
            },
          );

          return (
            <>
              <EventForm
                defaultValues={{
                  description: event.description,
                  name: event.name,
                }}
                errorMessage={editErrorMessage}
                renderFormContent={(formContent, eventForm) => {
                  return (
                    <form onSubmit={eventForm.handleSubmit(editEventHandler(eventForm))}>
                      <DialogTitle>
                        <English>Edit Event</English>
                        <Hebrew>ערוך אירוע</Hebrew>
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          <English>Edit the details of the event</English>
                          <Hebrew>ערוך את פרטי האירוע </Hebrew>
                        </DialogContentText>
                        {formContent}
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>
                          <>
                            <English>Cancel</English>
                            <Hebrew>בטל</Hebrew>
                          </>
                        </Button>
                        <QueryButton loading={editLoading} type={'submit'}>
                          <English>Update</English>
                          <Hebrew>עדכן</Hebrew>
                        </QueryButton>
                        {/*<Button type={'submit'}>{loadingState == 'idle' ? 'Create' : <Loading />}</Button>*/}
                      </DialogActions>
                    </form>
                  );
                }}
              />
            </>
          );
        }}
      />
    </>
  );
};
