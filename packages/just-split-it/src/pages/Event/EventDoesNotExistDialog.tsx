import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions } from '@mui/material';
import Button from '@mui/material/Button';

interface EventDoesNotExistDialogProps {
  open: boolean;
  // close: () => void;
}

export const EventDoesNotExistDialog = (props: EventDoesNotExistDialogProps) => {
  const { open } = props;
  const navigate = useNavigate();
  console.log(open);
  return (
    <>
      <Dialog open={true}>
        <DialogTitle>Event does not exists</DialogTitle>
        <DialogContent>
          This Event does not seem to exists. <br />
          you can create new event at home page.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              navigate('/');
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
