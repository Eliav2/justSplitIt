import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import Container from '@mui/material/Container';

const FlexBox = styled(Box)({
  display: 'flex',
});

const CenteredFlexBox = styled(FlexBox)({
  justifyContent: 'center',
  alignItems: 'center',
});
export const ColumnFlexBox = styled(FlexBox)({
  alignItems: 'center',
  flexDirection: 'column',
});

const FullSizeCenteredFlexBox = styled(CenteredFlexBox)({
  width: '100%',
  height: '100%',
});
export const FullSizeCenteredFlexBoxColumn = styled(FullSizeCenteredFlexBox)({
  flexDirection: 'column',
});
export const FullSizeMiddleFlexContainerColumn = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

export { FlexBox, CenteredFlexBox, FullSizeCenteredFlexBox };
