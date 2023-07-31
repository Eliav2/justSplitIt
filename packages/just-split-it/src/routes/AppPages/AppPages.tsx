import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';

import Box from '@mui/material/Box';

import { routes, protectedRoutes } from '..';
import { getPageHeight } from './utils';
import RequireAuth from '@/components/ProtectedRoute/RequireAuth';
import Header from '@/sections/Header';
import Sidebar from '@/sections/Sidebar';

const Layout = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Outlet />
    </>
  );
};

// todo: change to  data browser ('createBroswerRouter')
function AppPages() {
  return (
    <BrowserRouter>
      <Box sx={{ height: (theme) => getPageHeight(theme) }}>
        <Routes>
          <Route element={<Layout />}>
            {/* public routes */}
            {Object.values(routes).map(({ path, component: Component }) => {
              return <Route key={path} path={path} element={<Component />} />;
            })}
            {/* protected routes (only signed-in users can see  */}
            {Object.values(protectedRoutes).map(({ path, component: Component }) => {
              return (
                <Route
                  key={path}
                  path={path}
                  element={
                    <RequireAuth>
                      <Component />
                    </RequireAuth>
                  }
                />
              );
            })}
          </Route>
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default AppPages;
