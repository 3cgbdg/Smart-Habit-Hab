import { useMemo } from 'react';
import { WeekStats, DayStats } from '@/types/habits';

// returns data in format { day: string, completed: number, missed: number, fullDate: string, count: number }
export const useHabitChartData = (data: WeekStats | undefined) => {
  return useMemo(() => {
    if (!data || !data.completed) return [];

    return data.completed.map((item: DayStats, index: number) => {
      const date = new Date(item.date);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: item.count,
        count: item.count, // for components that only expect 'count'
        missed: data.missed ? data.missed[index]?.count || 0 : 0,
        fullDate: item.date,
      };
    });
  }, [data]);
};
