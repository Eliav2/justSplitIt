import { useGetUserEvents } from '@/utils/firebase/firestore/queris/hooks';
import useSidebar from '@/store/sidebar';
import { DialogActions, DialogContentText, ListSubheader } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemButton from '@mui/material/ListItemButton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ListItemIcon from '@mui/material/ListItemIcon';
import DefaultIcon from '@mui/icons-material/Deblur';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Loading from '@/components/Loading';
import { deleteEvent } from '@/utils/firebase/firestore/queris/queries';
import { FirestoreEvent, FirestoreEventWithId } from '@/utils/firebase/firestore/schema';
import ConfirmDialogButton, {
  ConfirmDialogButtonProps,
} from '@/components/Dialog/ConfirmDialogButton';

interface DeleteEventDialogButtonProps {
  event: FirestoreEventWithId;
}

const DeleteEventDialogButton = (props: DeleteEventDialogButtonProps) => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  return (
    <ConfirmDialogButton
      content={
        <DialogContent>
          This will delete the event and all the related expenses. <br />
          this action cannot be undone. Are you sure you want to delete this event?
        </DialogContent>
      }
      handleConfirm={async (close) => {
        if (eventId === props.event.id) {
          navigate('/');
        }
        close();

        await deleteEvent(props.event.id);
      }}
    />
  );
};

export const EventsSubmenu = () => {
  const [events, loading] = useGetUserEvents();
  const [isSidebarOpen, sidebarActions] = useSidebar();

  const { eventId } = useParams();

  return (
    <>
      {/*<AlertDialog />*/}
      <ListSubheader sx={{ pt: 2 }}>Events</ListSubheader>
      <List sx={{ width: 250 }}>
        {events.map((event) => (
          <ListItem
            sx={{ p: 0 }}
            key={event.id}
            secondaryAction={<DeleteEventDialogButton event={event} />}
          >
            <ListItemButton
              component={Link}
              to={`/event/${event.id}`}
              onClick={sidebarActions.close}
            >
              <ListItemIcon>{<DefaultIcon />}</ListItemIcon>
              <ListItemText>{event.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

// function AlertDialog() {
//   const [open, setOpen] = useState(false);
//
//   const handleClickOpen = () => {
//     setOpen(true);
//   };
//
//   const handleClose = () => {
//     setOpen(false);
//   };
//
//   return (
//     <div>
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Open alert dialog
//       </Button>
//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>{"Use Google's location service?"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Let Google help apps determine location. This means sending anonymous location data to
//             Google, even when no apps are running.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Disagree</Button>
//           <Button onClick={handleClose} autoFocus>
//             Agree
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }
