import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import Box from '@mui/material/Box';

import { protectedRoutes, routes } from '..';
import { getPageHeight } from './utils';
import RequireAuth from '@/components/ProtectedRoute/RequireAuth';
import Header from '@/sections/Header';
import Sidebar from '@/sections/Sidebar';
import Footer from '@/sections/Footer';
import Container from '@mui/material/Container';
import { FullSizeMiddleFlexContainerColumn } from '@/components/styled';

const Layout = () => {
  return (
    <>
      <Header />
      <Sidebar />
      {/*<FullSizeMiddleFlexContainerColumn>*/}
      <Outlet />
      {/*</FullSizeMiddleFlexContainerColumn>*/}
      {/*<Footer />*/}
    </>
  );
};

// todo: change to  data browser ('createBroswerRouter')
function AppPages() {
  return (
    <Box
      sx={{
        height: (theme) => getPageHeight(theme),
        // height: '100vh',
      }}
    >
      <BrowserRouter>
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
      </BrowserRouter>
    </Box>
  );
}

export default AppPages;
