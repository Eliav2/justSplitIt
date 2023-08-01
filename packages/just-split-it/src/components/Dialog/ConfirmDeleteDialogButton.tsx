import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogContent from '@mui/material/DialogContent';
import ConfirmDialogButton from '@/components/Dialog/ConfirmDialogButton';

export interface ConfirmDialogButtonProps {
  handleConfirm: (close: () => void) => void;
  titleText?: string;
  content?: React.ReactNode;
  confirmDialogButtonLabel?: string;
  cancelDialogButtonLabel?: string;
  buttonElement?: (handleOpen: () => void) => React.ReactNode;
  open?: boolean;
}

const ConfirmDeleteDialogButton = (props: ConfirmDialogButtonProps) => {
  const [open, setOpen] = useState(false);
  const _open = props.open ?? open;

  const handleCancel = () => {
    setOpen(false);
  };

  const _handleOpen = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    props.handleConfirm(handleCancel);
  };

  const _props = { ...props };
  //remove undefined props
  Object.keys(_props).forEach(
    (key) => (_props as any)[key] === undefined && delete (_props as any)[key],
  );

  const p = {
    ...{
      buttonElement: (handleOpen: () => void = _handleOpen) => (
        <IconButton edge="end" aria-label="delete" onClick={handleOpen}>
          <DeleteIcon />
        </IconButton>
      ),
    },
    ..._props,
  };

  return (
    <ConfirmDialogButton
      open={_open}
      dialogHandleConfirm={handleConfirm}
      content={
        <DialogContent>
          Are you sure? <br />
          this action cannot be undone.
        </DialogContent>
      }
      titleText={'Delete Confirmation'}
      buttonElement={p.buttonElement}
    />
  );
  // return (
  //   <>
  //     {p.buttonElement(_handleOpen)}
  //     <Dialog open={_open} disableRestoreFocus>
  //       <DialogTitle>{p.titleText}</DialogTitle>
  //       {p.content}
  //       <DialogActions>
  //         <Button onClick={handleCancel}>{p.cancelDialogButtonLabel}</Button>
  //         <Button autoFocus onClick={handleConfirm}>
  //           {p.confirmDialogButtonLabel}
  //         </Button>
  //       </DialogActions>
  //     </Dialog>
  //   </>
  // );
};
export default ConfirmDeleteDialogButton;
