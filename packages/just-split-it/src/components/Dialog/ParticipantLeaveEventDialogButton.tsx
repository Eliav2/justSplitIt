import { FirestoreEventWithId } from '@/utils/firebase/firestore/schema';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmDeleteDialogButton from '@/pages/Event/ExpensesList/ExpenseListItem/ConfirmDeleteDialogButton';
import DialogContent from '@mui/material/DialogContent';
import { deleteEvent, participantLeavesEvent } from '@/utils/firebase/firestore/queris/set';
import ConfirmDialogButton from '@/components/Dialog/ConfirmDialogButton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import Button from '@mui/material/Button';
import { DialogContentText } from '@mui/material';

interface ParticipantLeaveEventDialogButtonProps {
  eventId: string;
}

const ParticipantLeaveEventDialogButton = (props: ParticipantLeaveEventDialogButtonProps) => {
  const [user] = useAuthState(fbAuth);
  const navigate = useNavigate();
  const { eventId } = useParams();

  if (!eventId || !user) return null;

  return (
    <ConfirmDialogButton
      content={
        <DialogContent>
          Are you sure you want to leave? <br />
          <DialogContentText>you can re-join any time.</DialogContentText>
        </DialogContent>
      }
      dialogHandleConfirm={async (close) => {
        if (eventId === props.eventId) {
          navigate('/');
        }
        close();

        // console.log(eventId, user?.uid);
        await participantLeavesEvent(eventId, user?.uid);
      }}
      buttonElement={(handleOpen) => (
        <Button onClick={handleOpen} color={'warning'}>
          Leave Event
        </Button>
      )}
    />
  );
};
export default ParticipantLeaveEventDialogButton;
