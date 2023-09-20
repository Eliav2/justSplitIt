import FormRenderer, { FormRendererProps } from '@/components/Form/FormRenderer';
import { Controller, useForm } from 'react-hook-form';
import { FormHelperText, TextField } from '@mui/material';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';
import { IEventForm } from '@/pages/EventPage/NewEventDialogButton';

interface EventFormProps extends FormRendererProps<IEventForm> {
  errorMessage: string;
  defaultValues?: Partial<IEventForm>;
}

export const EventForm = ({
  errorMessage,
  renderFormContent,
  defaultValues: { name = '', description = '' } = {},
}: EventFormProps) => {
  const eventForm = useForm<IEventForm>({
    defaultValues: {
      name: name,
      description: description,
    },
  });

  return (
    <FormRenderer formHook={eventForm} renderFormContent={renderFormContent}>
      <Controller
        name={'name'}
        control={eventForm.control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            error={!!error}
            helperText={error ? error.message : null}
            autoFocus
            required
            size="small"
            onChange={onChange}
            value={value}
            fullWidth
            label={
              <>
                <English>Event name</English>
                <Hebrew>שם האירוע</Hebrew>
              </>
            }
            margin="dense"
            type="text"
            variant="standard"
          />
        )}
      />
      <Controller
        name={'description'}
        control={eventForm.control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            size="small"
            onChange={onChange}
            value={value}
            fullWidth
            label={
              <>
                <English>Description</English>
                <Hebrew>תיאור(לא חובה)</Hebrew>
              </>
            }
            margin="dense"
            type="text"
            variant="standard"
            error={!!error}
            helperText={error ? error.message : null}
            multiline
          />
        )}
      />
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </FormRenderer>
  );
};
