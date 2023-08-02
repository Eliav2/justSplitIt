import { FirestoreEventWithId } from '@/utils/firebase/firestore/schema';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';

// interface ConfirmDialogButtonBaseProps {
//   //for controlled state
//   open?: boolean;
//   titleText?: string;
//   content?: React.ReactNode;
//   buttonElement?: (handleOpen: () => void) => React.ReactNode;
//
//   dialogConfirmButtonLabel?: string;
//   dialogCancelButtonLabel?: string;
// }
//
// interface ConfirmDialogButtonBaseHandleConfirmProps extends ConfirmDialogButtonBaseProps {
//   dialogHandleConfirm: (close: () => void) => void;
// }
//
// interface ConfirmDialogButtonBaseDialogButtonProps extends ConfirmDialogButtonBaseProps {
//   dialogConfirmButton: React.ReactNode;
// }

type ConfirmDialogButtonBaseProps = {
  //for controlled state
  open?: boolean;
  titleText?: string;
  content?: React.ReactNode;
  buttonElement?: (handleOpen: (e: React.BaseSyntheticEvent) => void) => React.ReactNode;

  dialogConfirmButtonLabel?: string;
  dialogCancelButtonLabel?: string;
};
export type ConfirmDialogButtonProps = ConfirmDialogButtonBaseProps &
  (
    | { dialogHandleConfirm: (close: (e: React.BaseSyntheticEvent) => void) => void }
    | { dialogConfirmButton: React.ReactNode }
  );

const ConfirmDeleteDialogButton = (props: ConfirmDialogButtonProps) => {
  const [open, setOpen] = useState(false);
  const _open = props.open ?? open;

  const handleCancel = (e: React.BaseSyntheticEvent) => {
    e?.stopPropagation();
    setOpen(false);
  };

  const _handleOpen = (e: React.BaseSyntheticEvent) => {
    e?.stopPropagation();

    setOpen(true);
  };

  const _props = { ...props };
  //remove undefined props
  Object.keys(_props).forEach(
    (key) => (_props as any)[key] === undefined && delete (_props as any)[key],
  );

  const p = {
    ...({
      titleText: 'Confirmation',
      content: <DialogContent>Are you sure?</DialogContent>,
      dialogConfirmButtonLabel: 'Yes',
      dialogCancelButtonLabel: 'Cancel',
      buttonElement: (handleOpen: (e: React.BaseSyntheticEvent) => void = _handleOpen) => (
        <Button onClick={handleOpen}>Confirm Dialog</Button>
      ),
    } satisfies ConfirmDialogButtonBaseProps),
    ..._props,
  };

  let dialogConfirmButton: React.ReactNode;
  if ('dialogConfirmButton' in props) {
    dialogConfirmButton = props.dialogConfirmButton;
  } else {
    dialogConfirmButton = (
      <Button
        autoFocus
        onClick={() => {
          props.dialogHandleConfirm(handleCancel);
        }}
      >
        {p.dialogConfirmButtonLabel}
      </Button>
    );
  }

  return (
    <>
      {p.buttonElement(_handleOpen)}
      <Dialog open={_open} disableRestoreFocus>
        <DialogTitle>{p.titleText}</DialogTitle>
        {p.content}
        <DialogActions>
          <Button onClick={handleCancel}>{p.dialogCancelButtonLabel}</Button>
          {dialogConfirmButton}
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ConfirmDeleteDialogButton;
