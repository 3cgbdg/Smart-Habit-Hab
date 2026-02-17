import { User } from 'src/users/entities/user.entity';
import { Habit } from 'src/habits/entities/habit.entity';
import { HabitLog, Status } from 'src/habit_logs/entities/habit_log.enitity';
import { Experiment, ExperimentStatus } from 'src/experiments/entities/experiments.entity';

let counter = 0;
const nextId = () => {
  counter++;
  return `00000000-0000-4000-a000-${String(counter).padStart(12, '0')}`;
};

export const resetFactoryCounter = () => {
  counter = 0;
};

export const createMockUser = (overrides: Partial<User> = {}): User => {
  const id = nextId();
  return {
    id,
    email: `user-${id}@test.com`,
    darkMode: false,
    emailNotifications: true,
    habits: [],
    experiments: [],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  } as User;
};

export const createMockHabit = (overrides: Partial<Habit> = {}): Habit => {
  const id = nextId();
  return {
    id,
    userId: nextId(),
    name: `Test Habit ${id}`,
    description: 'A test habit',
    isActive: true,
    streak: 0,
    logs: [],
    experiments: [],
    user: {} as User,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  } as Habit;
};

export const createMockHabitLog = (overrides: Partial<HabitLog> = {}): HabitLog => {
  const id = nextId();
  return {
    id,
    habitId: nextId(),
    date: '2025-01-15',
    status: Status.PENDING,
    habit: {} as Habit,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  } as HabitLog;
};

export const createMockExperiment = (overrides: Partial<Experiment> = {}): Experiment => {
  const id = nextId();
  return {
    id,
    userId: nextId(),
    habitId: nextId(),
    name: `Test Experiment ${id}`,
    variable: 'test variable',
    startDate: '2025-01-01',
    endDate: null,
    status: ExperimentStatus.RUNNING,
    user: {} as User,
    habit: {} as Habit,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  } as Experiment;
};

export const createMockAuthRequest = (userId?: string) => {
  return {
    user: { id: userId ?? nextId() },
    cookies: {} as Record<string, string | undefined>,
  };
};
