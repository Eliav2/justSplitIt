import GitHubIcon from '@mui/icons-material/GitHub';
import ThemeIcon from '@mui/icons-material/InvertColors';
import MenuIcon from '@mui/icons-material/Menu';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

import { CenteredFlexBox, FlexBox } from '@/components/styled';
import { repository, title } from '@/config';
import useNotifications from '@/store/notifications';
import useSidebar from '@/store/sidebar';
import useTheme from '@/store/theme';

import { getRandomJoke } from './utils';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import Typography from '@mui/material/Typography';
import { redirect } from 'react-router-dom';
import { protectedRoutes, routes } from '@/routes';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  MenuList,
  Popover,
  PopoverProps,
  Theme,
  useMediaQuery,
} from '@mui/material';
import QueryIndicator from '@/components/QueryIndicator';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRef, useState } from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

function Header() {
  const [, sidebarActions] = useSidebar();
  const [, themeActions] = useTheme();
  const [, notificationsActions] = useNotifications();
  // const isSmallScreen = useMediaQuery((theme: Theme) =>
  //   theme.breakpoints.down('(min-width:600px)'),
  // );
  const isSmallScreen = useMediaQuery('(max-width:500px)');

  const [user, userLoading, userError] = useAuthState(fbAuth);
  const navigate = useNavigate();

  function showNotification() {
    notificationsActions.push({
      options: {
        // Show fully customized notification
        // Usually, to show a notification, you'll use something like this:
        // notificationsActions.push({ message: ... })
        // `message` accepts string as well as ReactNode
        // But you also can use:
        // notificationsActions.push({ options: { content: ... } })
        // to show fully customized notification
        content: (
          <Alert severity="info">
            <AlertTitle>Notification demo (random IT jokes :))</AlertTitle>
            {getRandomJoke()}
          </Alert>
        ),
      },
    });
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="transparent" elevation={1} position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <FlexBox sx={{ alignItems: 'center' }}>
            <IconButton
              onClick={sidebarActions.toggle}
              size="large"
              edge="start"
              color="info"
              aria-label="menu"
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Button
              // onClick={showNotification}
              onClick={() => navigate(routes.Welcome.path)}
              color="info"
              sx={{ textTransform: 'none' }}
              autoCapitalize={'false'}
            >
              {title}
            </Button>
          </FlexBox>
          <FlexBox>
            <CenteredFlexBox>
              <QueryIndicator loading={userLoading}>
                {user && <Typography>{user.displayName}</Typography>}
                <IconButton
                  onClick={() => {
                    navigate(protectedRoutes.User.path);
                  }}
                  size="large"
                  edge="start"
                  color="primary"
                  aria-label="menu"
                  sx={{ ml: 1 }}
                >
                  <AccountCircleIcon />
                </IconButton>
              </QueryIndicator>
            </CenteredFlexBox>

            {isSmallScreen ? (
              <CollapsedMenu />
            ) : (
              <>
                <Divider orientation="vertical" flexItem />
                <Tooltip title="It's open source" arrow>
                  <IconButton
                    color="primary"
                    size="large"
                    component="a"
                    href={repository}
                    target="_blank"
                  >
                    <GitHubIcon />
                  </IconButton>
                </Tooltip>
                <Divider orientation="vertical" flexItem />
                <Tooltip title="Switch theme" arrow>
                  <IconButton color="primary" edge="end" size="large" onClick={themeActions.toggle}>
                    <ThemeIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </FlexBox>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const CollapsedMenu = () => {
  const [, themeActions] = useTheme();

  return (
    <ButtonMenu
      renderButton={(handleToggle, buttonRef) => {
        return (
          <IconButton ref={buttonRef} onClick={handleToggle}>
            <MoreVertIcon />
          </IconButton>
        );
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <MenuList>
        <MenuItem onClick={themeActions.toggle}>
          <ListItemIcon>
            <ThemeIcon color={'primary'} />
          </ListItemIcon>
          <ListItemText>Toggle Theme</ListItemText>
        </MenuItem>
        <MenuItem component={'a'} href={repository} target="_blank" rel="noopener noreferrer">
          <ListItemIcon>
            <GitHubIcon color={'primary'} />
          </ListItemIcon>
          <ListItemText>Source code</ListItemText>
        </MenuItem>
      </MenuList>
    </ButtonMenu>
  );
};

interface ButtonMenuProps extends Omit<PopoverProps, 'open'> {
  open?: boolean;
  renderButton?: (handleToggle: () => void, ref: React.MutableRefObject<any>) => JSX.Element;
}

const ButtonMenu = ({ children, renderButton, open, ...props }: ButtonMenuProps) => {
  const [managedOpen, setManagedOpen] = useState(false);
  const handleToggle = () => {
    return setManagedOpen(!managedOpen);
  };

  const buttonRef = useRef<any>(null);

  const _open = open ?? managedOpen;

  const _renderButton =
    renderButton ??
    ((_handleToggle = handleToggle, _buttonRef = buttonRef) => {
      return (
        <Button ref={_buttonRef} variant="contained" onClick={_handleToggle}>
          Open Popover
        </Button>
      );
    });

  return (
    <>
      {_renderButton(handleToggle, buttonRef)}
      <Menu {...props} open={_open} anchorEl={buttonRef.current} onClose={handleToggle}>
        {children}
      </Menu>
    </>
  );
};

export default Header;
