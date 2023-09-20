import { useState } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { removeUndefined } from '@/utils/general';

type DialogButtonProps = {
  //for controlled state
  open?: boolean;
  dialogContent?: React.ReactNode;
  buttonElement?: (handleOpen: () => void) => React.ReactNode;
  dialogProps?: DialogProps;
};

const DialogButton = (props: DialogButtonProps) => {
  const [open, setOpen] = useState(false);
  const _open = props.open ?? open;

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const _props = removeUndefined(props);

  const p = {
    ...({
      dialogContent: <DialogContent>Are you sure?</DialogContent>,
      buttonElement: (handleOpen: () => void = handleOpenDialog) => (
        <Button onClick={handleOpen}>Open Dialog</Button>
      ),
    } satisfies DialogButtonProps),
    ..._props,
  };

  return (
    <>
      {p.buttonElement(handleOpenDialog)}
      <Dialog open={_open} {...props.dialogProps}>
        {props.dialogContent}
      </Dialog>
    </>
  );
};
export default DialogButton;
