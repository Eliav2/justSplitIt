import { useGetUserEvents } from '@/utils/firebase/firestore/queris/get';
import useSidebar from '@/store/sidebar';
import { ListSubheader } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { Link, useParams } from 'react-router-dom';
import ListItemText from '@mui/material/ListItemText';
import QueryIndicator from '@/components/QueryIndicator';
import { DeleteEventDialogButton } from '@/components/Dialog/DeleteEventDialogButton';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';

export const YourEvents = () => {
  const [events, loading, error] = useGetUserEvents();
  const eventsData = events?.docs.map((event) => Object.assign({}, event.data(), { id: event.id }));
  // const { docs: events, loading, error } = useGetUserEvents();
  const [isSidebarOpen, sidebarActions] = useSidebar();

  const { eventId } = useParams();

  return (
    <>
      {/*<AlertDialog />*/}
      <ListSubheader sx={{ pt: 2 }}>
        <English>Your Events</English>
        <Hebrew>האירועים שלך</Hebrew>
      </ListSubheader>
      <List sx={{ width: 250 }}>
        <QueryIndicator loading={loading} errorMessage={error?.message}>
          {eventsData?.map((event) => (
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
                {/*<ListItemIcon>{<DefaultIcon />}</ListItemIcon>*/}
                <ListItemText>{event.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </QueryIndicator>
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
