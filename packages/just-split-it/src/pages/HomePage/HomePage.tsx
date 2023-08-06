import Meta from '@/components/Meta';
import {
  ColumnFlexBox,
  FullSizeCenteredFlexBox,
  FullSizeCenteredFlexBoxColumn,
  FullSizeMiddleFlexContainerColumn,
} from '@/components/styled';
import useOrientation from '@/hooks/useOrientation';

import { useNavigate } from 'react-router-dom';
import { NewEventDialog } from '@/pages/EventPage/NewEventDialog';
import Typography from '@mui/material/Typography';
import { fbAuth } from '@/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Button from '@mui/material/Button';
import QueryIndicator from '@/components/QueryIndicator';
import { useLoginUser } from '@/utils/login/useLoginUser';
import { keyframes } from '@emotion/react';
import { makeStyles, useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import useThemeMode from '@/store/theme/useThemeMode';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import useLanguage from '@/store/theme/useThemeLanguage';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';
import { LanguageMode } from '@/components/Language';

function HomePage() {
  // const [user, loading, error] = useAuthState(fbAuth);
  // console.log('user', user);
  const isPortrait = useOrientation();

  const navigate = useNavigate();

  const width = isPortrait ? '40%' : '30%';
  const height = isPortrait ? '30%' : '40%';

  // console.log('navigator.language', navigator.language);

  return (
    <>
      <Meta title="Home" />
      <FullSizeCenteredFlexBoxColumn>
        <CrazyHugeHeader />
        <LoginOrAddEventButton />
        {/*<ColumnFlexBox>*/}
        {/*<Typography variant={'h1'}>JustSplitIt</Typography>*/}
        {/*</ColumnFlexBox>*/}
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

const LoginOrAddEventButton = () => {
  const [user, loading, error] = useAuthState(fbAuth);
  const navigate = useNavigate();
  const { signInWithGoogle } = useLoginUser();

  return (
    <>
      {user ? (
        <NewEventDialog />
      ) : (
        <QueryIndicator loading={loading} errorMessage={error?.message}>
          <Button variant="contained" onClick={signInWithGoogle}>
            <English>Login</English>
            <Hebrew>התחבר</Hebrew>
          </Button>
          <Typography variant={'caption'} sx={{ p: 1 }}>
            <English>
              In order to add events, <br />
              You need to log in
            </English>
            <Hebrew>עליך להתחבר על מנת להוסיף אירועים</Hebrew>
          </Typography>
        </QueryIndicator>
      )}
    </>
  );
};

// todo: make it prettier
const CrazyHugeHeader = () => {
  const theme = useTheme();
  const [mode] = useThemeMode();

  const headerStyles = {
    // fontSize: '6rem', // Adjust the font size to make it huge
    // fontWeight: '300', // To make it bold and stand out
    color: theme.palette.primary.main, // A fun and pretty color
    textShadow: `4px 4px 8px ${
      mode == 'light' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'
    }`, // Add a subtle text shadow for a cool effect
    textAlign: 'center', // Center the text
    marginBottom: '1rem', // Add some spacing at the bottom
    // fontFamily: 'Roboto', // Specify a font
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h2" style={headerStyles as any}>
        JustSplitIt
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        <English>Shared expenses made easy</English>
        <Hebrew>חלוקת הוצאות בדרך הקלה</Hebrew>
      </Typography>
    </Box>
  );
};

// const CrazyHugeHeader = () => {
//   const theme = useTheme();
//
//   // Define the CSS keyframes animation
//   const slideGradient = keyframes`
//     0% {
//       background-position: 200% 0;
//       //background-clip: text;
//       //background: red;
//       //color: transparent;
//     }
//     50% {
//       background-position: -200% 0;
//       //background-clip: text;
//       //background: linear-gradient(45deg, red, blue);
//       //color: transparent;
//
//     }
//     100% {
//       background-position: -200% 0;
//       //background-clip: text;
//       //background: red;
//       //color: transparent;
//
//     }
//   `;
//
//   // Define the custom styled component using the styled function
//   const StyledHeader = styled(Typography)(({ theme }) => ({
//     fontSize: '6rem',
//     fontWeight: 'bold',
//     // backgroundSize: '30px 100%',
//     background: 'red',
//     // color: 'blue',
//     // backgroundPosition: '100%',
//     background: `linear-gradient(60deg, red, blue)`,
//     // background: `linear-gradient(60deg,${theme.palette.secondary.main}, ${theme.palette.secondary.main}, yellow,${theme.palette.secondary.main},${theme.palette.secondary.main})`,
//     // background: theme.palette.secondary.main,
//     backgroundClip: 'text',
//     color: 'transparent',
//     textShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)',
//     textAlign: 'center',
//     marginBottom: '2rem',
//     animation: `${slideGradient} 5s linear infinite`,
//     // animationDelay: '5s',
//     backgroundSize: '300% 100%', // To make the gradient wider than the text width
//   }));
//
//   return <StyledHeader variant="h1">JustSplitIt</StyledHeader>;
// };

// const CrazyHugeHeader = () => {
//   const theme = useTheme();
//
//   // Define the CSS keyframes animations
//   const purpleTitle = keyframes`
//     0% {
//       background: ${theme.palette.primary.main};
//     }
//     100% {
//       background: ${theme.palette.primary.main};
//     }
//   `;
//
//   const gradientAnimation = keyframes`
//     0% {
//       background-position: -200% 0;
//     }
//     100% {
//       background-position: 200% 0;
//     }
//   `;
//
//   // Define the custom styled component using the styled function
//   const StyledHeader = styled(Typography)(({ theme }) => ({
//     fontSize: '6rem',
//     fontWeight: 'bold',
//     color: theme.palette.common.white,
//     textShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)',
//     textAlign: 'center',
//     marginBottom: '2rem',
//     position: 'relative',
//     animation: `${purpleTitle} 5s linear 0s infinite, ${gradientAnimation} 3s linear 5s infinite`,
//     background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
//     backgroundClip: 'text',
//     '-webkit-background-clip': 'text',
//   }));
//
//   return <StyledHeader variant="h1">JustSplitIt</StyledHeader>;
// };

export default HomePage;
