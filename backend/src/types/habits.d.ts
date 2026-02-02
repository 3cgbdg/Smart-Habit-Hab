export interface IWeeklyStats {
  day: string;
  count: number;
  completed?: number;
  missed?: number;
}

export interface ICompletionRate {
  id: string;
  completionRate: number;
}
