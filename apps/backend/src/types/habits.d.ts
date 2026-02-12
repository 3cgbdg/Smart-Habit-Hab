export interface IDayStats {
  date: string;
  count: number;
}

export interface IWeekStats {
  completed: IDayStats[];
  missed?: IDayStats[];
}
export interface ICompletionRate {
  id: string;
  completionRate: number;
}

export interface IHabitMonthlyRawStats {
  habitId: string;
  total: string;
  completed: string;
}

export interface IWeeklyRawStats {
  date: Date;
  completedCount: string;
  missedCount?: string;
}
