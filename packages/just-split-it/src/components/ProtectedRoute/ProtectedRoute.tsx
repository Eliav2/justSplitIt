import React from 'react';
import RequireAuth from './RequireAuth';
import { Route, RouteProps } from 'react-router-dom';

type ProtectedRouteProps = RouteProps & {
  children?: any;
};
const ProtectedRoute = ({ children, ...routeProps }: ProtectedRouteProps) => {
  return (
    <RequireAuth>
      <Route {...routeProps}>{children}</Route>
    </RequireAuth>
  );
};

export default ProtectedRoute;
