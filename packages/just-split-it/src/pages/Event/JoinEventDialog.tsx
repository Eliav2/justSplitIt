import { useNavigate } from 'react-router-dom';
import { participantJoinsToEvent } from '@/utils/firebase/firestore/queris/set';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import { User } from 'firebase/auth';

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
      <DialogTitle>Join Event</DialogTitle>
      <DialogContent>
        You are not participating in this event <br />
        would you like to join?
      </DialogContent>

      <DialogActions>
        <Button onClick={handleReject}>Nope. I'm out</Button>
        <Button autoFocus onClick={handleJoin}>
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};
