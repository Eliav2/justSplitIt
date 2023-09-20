import { Link, useParams } from 'react-router-dom';

import DefaultIcon from '@mui/icons-material/Deblur';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { protectedRoutes, routes } from '@/routes';
import useSidebar from '@/store/sidebar';
import type { Routes } from '@/routes/types';
import { EventsSubmenu } from '@/sections/Sidebar/EventsSubmenu';
import { TextField } from '@mui/material';

const sidebarRoutes: Routes = { ...routes, ...protectedRoutes } as const satisfies Routes;

function Sidebar() {
  const [isSidebarOpen, sidebarActions] = useSidebar();

  return (
    <SwipeableDrawer
      SwipeAreaProps={{
        width: 10,
        // maxWidth: 600,
      }}
      anchor="left"
      open={isSidebarOpen}
      onClose={sidebarActions.close}
      onOpen={sidebarActions.open}
      disableBackdropTransition={false}
      swipeAreaWidth={30}
      sx={{
        maxWidth: '60%', // Set your maximum width value here
        '& .MuiDrawer-paper': {
          maxWidth: '60%', // Apply the same value to the drawer paper
        },
      }}
    >
      <List sx={{ width: 250, pt: (theme) => `${theme.mixins.toolbar.minHeight}px` }}>
        {Object.values(sidebarRoutes)
          .filter((route) => route.title && (route?.showInSidebar ?? true))
          .map(({ path, title, icon: Icon }) => (
            <ListItem sx={{ p: 0 }} key={path}>
              <ListItemButton component={Link} to={path as string} onClick={sidebarActions.close}>
                <ListItemIcon>{Icon ? <Icon /> : <DefaultIcon />}</ListItemIcon>
                <ListItemText>{title}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <EventsSubmenu />
    </SwipeableDrawer>
  );
}

export default Sidebar;
