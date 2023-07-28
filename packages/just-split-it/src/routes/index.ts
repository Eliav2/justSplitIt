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
  Page1: {
    component: asyncComponentLoader(() => import('@/pages/Page1')),
    path: '/page-1',
    title: 'Page 1',
    icon: GitHubIcon,
  },
  Page2: {
    component: asyncComponentLoader(() => import('@/pages/Page2')),
    path: '/page-2',
    title: 'Page 2',
    icon: AddTaskIcon,
  },
  Page3: {
    component: asyncComponentLoader(() => import('@/pages/Page3')),
    path: '/page-3',
    title: 'Page 3',
    icon: TerrainIcon,
  },
  Page4: {
    component: asyncComponentLoader(() => import('@/pages/Page4')),
    path: '/page-4',
    title: 'Page 4',
    icon: BugReportIcon,
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
