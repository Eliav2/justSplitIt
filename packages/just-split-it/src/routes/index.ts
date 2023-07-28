import AddTaskIcon from '@mui/icons-material/AddTask';
import BugReportIcon from '@mui/icons-material/BugReport';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import TerrainIcon from '@mui/icons-material/Terrain';

import asyncComponentLoader from '@/utils/loader';

import { Routes } from './types';

export const routes: Routes = {
  Welcome: {
    component: asyncComponentLoader(() => import('@/pages/Welcome')),
    path: '/',
    title: 'Welcome',
    icon: HomeIcon,
  },
  Login: {
    component: asyncComponentLoader(() => import('@/pages/Login')),
    path: '/login',
    title: 'Login',
    icon: HomeIcon,
  },
  NotFound: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
} as const;

export const protectedRoutes = {
  Home: {
    component: asyncComponentLoader(() => import('@/pages/Home')),
    path: '/Home',
    title: 'Home',
    icon: HomeIcon,
  },
  User: {
    component: asyncComponentLoader(() => import('@/pages/User')),
    path: '/user',
    title: 'User',
    icon: HomeIcon,
  },
} as const;
