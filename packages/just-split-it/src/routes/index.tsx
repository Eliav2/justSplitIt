import HomeIcon from '@mui/icons-material/Home';

import asyncComponentLoader from '@/utils/loader';

import { Routes } from './types';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';
import SettingsIcon from '@mui/icons-material/Settings';
export const routes = {
  Welcome: {
    component: asyncComponentLoader(() => import('@/pages/HomePage/HomePage')),
    path: '/',
    title: (
      <>
        <English>Home</English>
        <Hebrew>דף הבית</Hebrew>
      </>
    ),
    icon: HomeIcon,
  },
  Login: {
    component: asyncComponentLoader(() => import('@/pages/LoginPage/LoginPage')),
    path: '/login',
    title: (
      <>
        <English>Login</English>
        <Hebrew>התחבר</Hebrew>
      </>
    ),
    icon: HomeIcon,
    showInSidebar: false,
  },
  Settings: {
    component: asyncComponentLoader(() => import('@/pages/SettingsPage')),
    path: '/settings',
    title: (
      <>
        <English>Settings</English>
        <Hebrew>הגדרות</Hebrew>
      </>
    ),
    icon: SettingsIcon,
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
    title: (
      <>
        <English>User</English>
        <Hebrew>החשבון שלי</Hebrew>
      </>
    ),
    icon: HomeIcon,
    showInSidebar: false,
  },
  Event: {
    component: asyncComponentLoader(() => import('@/pages/EventPage/EventPage')),
    path: '/event/:eventId',
  },
} as const satisfies Routes;
