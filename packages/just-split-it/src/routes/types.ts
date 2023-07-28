import { FC } from 'react';
import { PathRouteProps } from 'react-router-dom';

import type { SvgIconProps } from '@mui/material/SvgIcon';

enum Pages {
  Welcome,
  Page1,
  Page2,
  Page3,
  Page4,
  NotFound,
}

enum ProtectedPages {
  Home,
}

type PathRouteCustomProps = {
  title?: string;
  component: FC;
  icon?: FC<SvgIconProps>;
};

type Routes = Record<Pages, PathRouteProps & PathRouteCustomProps>;
type ProtectedRoutes = Record<ProtectedPages, PathRouteProps & PathRouteCustomProps>;

export type { Routes, ProtectedRoutes };
export { Pages, ProtectedPages };
