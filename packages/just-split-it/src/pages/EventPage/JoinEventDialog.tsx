import { useNavigate } from 'react-router-dom';
import { participantJoinsToEvent } from '@/utils/firebase/firestore/queris/set';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import { User } from 'firebase/auth';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';

interface JoinEventDialogProps {
  open: boolean;
  user: User | null | undefined;
  eventId: string;
}

export const JoinEventDialog = (props: JoinEventDialogProps) => {
  const navigate = useNavigate();

  function handleReject() {
    navigate('/');
  }

  function handleJoin() {
    if (!props.user?.uid) return;
    participantJoinsToEvent(props.eventId, props.user?.uid);
  }

  return (
    <Dialog open={props.open} disableRestoreFocus>
      <DialogTitle>
        <English>Join Event</English>
        <Hebrew>הצטרף לאירוע</Hebrew>
      </DialogTitle>
      <DialogContent>
        <English>
          You are not participating in this event <br />
          would you like to join?
        </English>
        <Hebrew>
          אתה לא משתתף באירוע הזה <br />
          תרצה להצטרף?
        </Hebrew>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleReject}>
          <English>Nope. I'm out</English>
          <Hebrew>נעע, לא תודה</Hebrew>
        </Button>
        <Button autoFocus onClick={handleJoin}>
          <English>Join</English>
          <Hebrew>צרף אותי!</Hebrew>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
