export const ROUTES = {
  DASHBOARD: '/dashboard',
  HABITS: '/habits',
  NEW_HABIT: '/habits/new',
  EXPERIMENTS: '/experiments',
  SETTINGS: '/settings',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
};

export const getHabitDetailsRoute = (id: string) => `/habits/${id}`;
export const getExperimentDetailsRoute = (id: string) => `/experiments/${id}`;
