

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
