import HomeIcon from '@mui/icons-material/Home';

import asyncComponentLoader from '@/utils/loader';

import { Routes } from './types';

export const routes = {
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
    showInSidebar: false,
  },
  NotFound: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
} as const satisfies Routes;

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
    showInSidebar: false,
  },
} as const satisfies Routes;
