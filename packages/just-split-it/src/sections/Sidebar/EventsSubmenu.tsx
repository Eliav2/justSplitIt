import { useGetUserEvents } from '@/utils/firebase/firestore/queris/hooks';
import useSidebar from '@/store/sidebar';
import { DialogActions, ListSubheader } from '@mui/material';
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

interface DeleteDialogButtonProps {
  event: FirestoreEventWithId;
}

const DeleteDialogButton = (props: DeleteDialogButtonProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // const { eventId: currentEventId } = useParams();
  const { eventId } = useParams();

  console.log(eventId);
  const handleYes = async () => {
    // setOpen(true);
    console.log('delete');
    await deleteEvent(props.event.id);

    if (params.currentEventId === props.event.id) {
      navigate('/');
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <IconButton edge="end" aria-label="delete" onClick={handleOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog open={open}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          This will delete the event and all the related expenses. <br />
          this action cannot be undone. Are you sure you want to delete this event?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const EventsSubmenu = () => {
  const [events, loading] = useGetUserEvents();
  const [isSidebarOpen, sidebarActions] = useSidebar();

  const { eventId } = useParams();
  console.log(eventId);

  return (
    <>
      <ListSubheader sx={{ pt: 2 }}>Events</ListSubheader>
      <List sx={{ width: 250 }}>
        {events.map((event) => (
          <ListItem
            sx={{ p: 0 }}
            key={event.id}
            secondaryAction={<DeleteDialogButton event={event} />}
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
