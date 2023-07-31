import Divider from '@mui/material/Divider';
import { CenteredFlexBox } from '@/components/styled';
import Typography from '@mui/material/Typography';
import version from '@/utils/version';

export const Footer = () => {
  return (
    <>
      <Divider />
      <CenteredFlexBox>
        <Typography>v{version}</Typography>
      </CenteredFlexBox>
    </>
  );
};
