import HomeIcon from '@mui/icons-material/Home';

import asyncComponentLoader from '@/utils/loader';

import { Routes } from './types';

export const routes = {
  Welcome: {
    component: asyncComponentLoader(() => import('@/pages/Home/Home')),
    path: '/',
    title: 'Home',
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
  User: {
    component: asyncComponentLoader(() => import('@/pages/User')),
    path: '/user',
    title: 'User',
    icon: HomeIcon,
    showInSidebar: false,
  },
  Event: {
    component: asyncComponentLoader(() => import('@/pages/Event/Event')),
    path: '/event/:eventId',
  },
} as const satisfies Routes;
