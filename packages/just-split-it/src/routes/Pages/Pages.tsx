import { Route, Routes } from 'react-router-dom';

import Box from '@mui/material/Box';

import { routes, protectedRoutes } from '..';
import { getPageHeight } from './utils';
import RequireAuth from '@/components/ProtectedRoute/RequireAuth';

function Pages() {
  return (
    <Box sx={{ height: (theme) => getPageHeight(theme) }}>
      <Routes>
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
      </Routes>
    </Box>
  );
}

export default Pages;
