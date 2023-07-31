import { FirestoreEventWithId } from '@/utils/firebase/firestore/schema';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';

export interface ConfirmDialogButtonProps {
  handleConfirm: (close: () => void) => void;
  titleText?: string;
  content?: React.ReactNode;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  open?: boolean;
}

const ConfirmDialogButton = (props: ConfirmDialogButtonProps) => {
  const [open, setOpen] = useState(false);
  const _open = props.open ?? open;

  const p = Object.assign(
    {},
    {
      titleText: 'Delete Confirmation',
      content: (
        <DialogContent>
          Are you sure? <br />
          this action cannot be undone.
        </DialogContent>
      ),
      confirmButtonLabel: 'Yes',
      cancelButtonLabel: 'Cancel',
    },
    props,
  );

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    props.handleConfirm(handleCancel);
  };

  return (
    <>
      <IconButton edge="end" aria-label="delete" onClick={handleOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog open={_open} disableRestoreFocus>
        <DialogTitle>{p.titleText}</DialogTitle>
        {p.content}
        <DialogActions>
          <Button onClick={handleCancel}>{p.cancelButtonLabel}</Button>
          <Button autoFocus onClick={handleConfirm}>
            {p.confirmButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ConfirmDialogButton;
