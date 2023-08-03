import { FirestoreEventWithId } from '@/utils/firebase/firestore/schema';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmDeleteDialogButton from '@/pages/EventPage/Event/ExpenseListItem/ConfirmDeleteDialogButton';
import DialogContent from '@mui/material/DialogContent';
import { deleteEvent } from '@/utils/firebase/firestore/queris/set';

interface DeleteEventDialogButtonProps {
  event: FirestoreEventWithId;
  buttonElement?: (handleOpen: () => void) => React.ReactNode;
}

export const DeleteEventDialogButton = (props: DeleteEventDialogButtonProps) => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  return (
    <ConfirmDeleteDialogButton
      content={
        <DialogContent>
          This will delete the event and all the related expenses. <br />
          this action cannot be undone. Are you sure you want to delete this event?
        </DialogContent>
      }
      handleConfirm={(close) => {
        if (eventId === props.event.id) {
          navigate('/');
        }
        close();

        deleteEvent(props.event.id);
      }}
      buttonElement={props.buttonElement}
    />
  );
};
