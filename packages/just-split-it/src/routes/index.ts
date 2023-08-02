import HomeIcon from '@mui/icons-material/Home';

import asyncComponentLoader from '@/utils/loader';

import { Routes } from './types';

export const routes = {
  Welcome: {
    component: asyncComponentLoader(() => import('@/pages/HomePage/HomePage')),
    path: '/',
    title: 'Home',
    icon: HomeIcon,
  },
  Login: {
    component: asyncComponentLoader(() => import('@/pages/LoginPage/LoginPage')),
    path: '/login',
    title: 'Login',
    icon: HomeIcon,
    showInSidebar: false,
  },
  NotFound: {
    component: asyncComponentLoader(() => import('@/pages/NotFoundPage/NotFoundPage')),
    path: '*',
  },
} as const satisfies Routes;

export const protectedRoutes = {
  User: {
    component: asyncComponentLoader(() => import('@/pages/UserPage/UserPage')),
    path: '/user',
    title: 'User',
    icon: HomeIcon,
    showInSidebar: false,
  },
  Event: {
    component: asyncComponentLoader(() => import('@/pages/EventPage/EventPage')),
    path: '/event/:eventId',
  },
} as const satisfies Routes;
