import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox, FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import useOrientation from '@/hooks/useOrientation';

import muiLogo from './logos/mui.svg';
import pwaLogo from './logos/pwa.svg';
import reactLogo from './logos/react_ed.svg';
import recoilLogo from './logos/recoil.svg';
import rrLogo from './logos/rr.svg';
import tsLogo from './logos/ts.svg';
import viteLogo from './logos/vite.svg';
import { Image } from './styled';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, DialogContentText, TextField } from '@mui/material';
import { useState } from 'react';
import { FirestoreError } from 'firebase/firestore';
import CircularProgress from '@mui/material/CircularProgress';
import { addEvent } from '@/utils/firebase/firestore/queries';

function Welcome() {
  // const [user, loading, error] = useAuthState(fbAuth);
  // console.log('user', user);
  const isPortrait = useOrientation();

  const navigate = useNavigate();

  const width = isPortrait ? '40%' : '30%';
  const height = isPortrait ? '30%' : '40%';

  return (
    <>
      <Meta title="Welcome" />
      <FullSizeCenteredFlexBoxColumn>
        <FullSizeCenteredFlexBox flexDirection={isPortrait ? 'column' : 'row'}>
          <Image alt="react-router" src={rrLogo} />
          <Image alt="vite" src={viteLogo} />
          <Image alt="typescript" src={tsLogo} />
          <Image alt="react" src={reactLogo} sx={{ width, height }} />
          <Image alt="mui" src={muiLogo} />
          <Image alt="recoil" src={recoilLogo} />
          <Image alt="pwa" src={pwaLogo} />
        </FullSizeCenteredFlexBox>
        <NewEventModal />
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

const NewEventModal = () => {
  const [eventName, setEventName] = useState('');
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingState, setLoadingState] = useState<'idle' | 'loading'>('idle');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleAddEvent = async () => {
    addEvent(eventName)
      .then(() => {
        setLoadingState('idle');
        setOpen(false);
      })
      .catch((e: FirestoreError) => {
        console.error(e);
        console.log(e.message);
        setLoadingState('idle');
        setErrorMessage(e.message);
      });

    // add the event to the list of the events in the user collection
    // Reference to the user document in the 'users' collection
  };

  const handleCreate = async () => {
    setLoadingState('loading');
    await handleAddEvent();
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create new Event
      </Button>
      <Dialog open={open} onClose={handleCreate}>
        <DialogTitle>New Event</DialogTitle>
        <DialogContent>
          <DialogContentText>Provide a name for the new event.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="event"
            label="Event"
            type="text"
            fullWidth
            variant="standard"
            helperText={errorMessage}
            error={errorMessage.length > 0}
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleCreate}>
            {loadingState == 'idle' ? 'Create' : <CircularProgress />}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Welcome;
