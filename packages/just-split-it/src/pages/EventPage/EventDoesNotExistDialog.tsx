import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';

interface EventDoesNotExistDialogProps {
  open: boolean;
  // close: () => void;
}

export const EventDoesNotExistDialog = (props: EventDoesNotExistDialogProps) => {
  const { open } = props;
  const navigate = useNavigate();

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>
          <English>Event does not exists</English>
          <Hebrew>אירוע זה לא קיים</Hebrew>
        </DialogTitle>
        <DialogContent>
          <English>
            This Event does not seem to exists. <br />
            you can create new event at home page.
          </English>
          <Hebrew>
            נראה שאת\ה מנסה לגשת לאירוע שלא קיים. יתכן כי נמחק. <br />
            את\ה יכול\ה לייצר אירוע חדש בעמוד הבית.
          </Hebrew>
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
