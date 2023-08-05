import { FC } from 'react';
import { PathRouteProps } from 'react-router-dom';

import type { SvgIconProps } from '@mui/material/SvgIcon';

interface PathRouteCustomProps extends PathRouteProps {
  title?: React.ReactNode;
  component: FC;
  icon?: FC<SvgIconProps>;
  showInSidebar?: boolean; //default true
}

export type Routes = { [key: string]: PathRouteCustomProps };
