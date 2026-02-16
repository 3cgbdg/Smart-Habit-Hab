export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  streak?: number;
  completionRate?: number;
  isActive?: boolean;
}

export interface DayStats {
  date: string;
  count: number;
}

export interface WeekStats {
  completed: DayStats[];
  missed?: DayStats[];
}

interface HabitFormProps {
  mode: 'create' | 'update';
  initialData?: Habit;
}

interface HabitMonthlyRawStats {
  habitId: string;
  total: string;
  completed: string;
}

interface WeeklyRawStats {
  date: Date;
  completedCount: string;
  missedCount?: string;
}
