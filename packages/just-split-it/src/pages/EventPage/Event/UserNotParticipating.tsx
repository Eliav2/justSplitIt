import Typography from '@mui/material/Typography';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';

export const UserNotParticipating = () => {
  return (
    <>
      <Typography variant={'body1'}>
        <English>You are not participating in this event</English>
        <Hebrew>את\ה לא משתתף\ת באירוע זה</Hebrew>
      </Typography>
    </>
  );
};
