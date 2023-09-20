import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogContent from '@mui/material/DialogContent';
import ConfirmDialogButton from '@/components/Dialog/ConfirmDialogButton';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';

export interface ConfirmDialogButtonProps {
  handleConfirm: (close: () => void) => void;
  content?: React.ReactNode;
  confirmDialogButtonLabel?: string;
  cancelDialogButtonLabel?: string;
  buttonElement?: (handleOpen: () => void) => React.ReactNode;
  open?: boolean;
}

const ConfirmDeleteDialogButton = (props: ConfirmDialogButtonProps) => {
  const _props = { ...props };
  //remove undefined props
  Object.keys(_props).forEach(
    (key) => (_props as any)[key] === undefined && delete (_props as any)[key],
  );

  const p = {
    ...{
      buttonElement: (handleOpen: () => void) => (
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={handleOpen}
          // style={{ marginInlineStart: 'auto' }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
    ..._props,
  };

  return (
    <ConfirmDialogButton
      dialogHandleConfirm={p.handleConfirm}
      content={
        <DialogContent>
          <English>
            Are you sure? <br />
            this action cannot be undone.
          </English>
          <Hebrew>
            אתה בטוח? <br />
            פעולה זו לא ניתנת לביטול.
          </Hebrew>
        </DialogContent>
      }
      titleText={
        <>
          <English>Delete Confirmation </English>
          <Hebrew>אישור מחיקה</Hebrew>
        </>
      }
      buttonElement={p.buttonElement}
    />
  );
};
export default ConfirmDeleteDialogButton;
