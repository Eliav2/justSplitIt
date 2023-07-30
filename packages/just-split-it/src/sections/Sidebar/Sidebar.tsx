import { Link } from 'react-router-dom';

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

const sidebarRoutes: Routes = { ...routes, ...protectedRoutes } as const satisfies Routes;

function Sidebar() {
  const [isSidebarOpen, sidebarActions] = useSidebar();

  // events.then((data) => {
  //   console.log(data);
  // });
  // useEffect(() => {
  //   (async () => {
  //     console.log(events);
  //   })();
  // }, []);

  return (
    <SwipeableDrawer
      anchor="left"
      open={isSidebarOpen}
      onClose={sidebarActions.close}
      onOpen={sidebarActions.open}
      disableBackdropTransition={false}
      swipeAreaWidth={30}
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
