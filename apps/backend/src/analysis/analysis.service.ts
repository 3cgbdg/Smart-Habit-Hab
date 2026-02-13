import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HabitLog, Status } from '../habit_logs/entities/habit_log.enitity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { IHabitMonthlyRawStats, IWeeklyRawStats, IWeekStats } from 'src/types/habits';
import { DateUtils } from 'src/utils/date.util';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(HabitLog)
    private readonly habitLogRepository: Repository<HabitLog>,
  ) {}

  private addStatsSelection(qb: SelectQueryBuilder<HabitLog>, alias: string = 'log') {
    return qb
      .addSelect(`SUM(CASE WHEN ${alias}.status = :completed THEN 1 ELSE 0 END)`, 'completedCount')
      .setParameter('completed', Status.COMPLETED);
  }

  async getSuccessRate(habitId: string, startDate: string, endDate: string): Promise<number> {
    const rates = await this.getBulkSuccessRates([{ habitId, startDate, endDate }]);
    return rates[habitId] || 0;
  }

  async getBulkSuccessRates(
    queries: { habitId: string; startDate: string; endDate: string }[],
  ): Promise<Record<string, number>> {
    if (queries.length === 0) return {};

    const qb = this.habitLogRepository
      .createQueryBuilder('log')
      .select('log.habitId', 'habitId')
      .addSelect('COUNT(*)', 'total')
      .addSelect('SUM(CASE WHEN log.status = :completed THEN 1 ELSE 0 END)', 'completed')
      .setParameter('completed', Status.COMPLETED);

    queries.forEach((q, index) => {
      const condition = `(log.habitId = :hId${index} AND log.date BETWEEN :sDate${index} AND :eDate${index})`;
      if (index === 0) {
        qb.where(condition);
      } else {
        qb.orWhere(condition);
      }
      qb.setParameter(`hId${index}`, q.habitId);
      qb.setParameter(`sDate${index}`, q.startDate);
      qb.setParameter(`eDate${index}`, q.endDate);
    });

    const stats = await qb.groupBy('log.habitId').getRawMany<{
      habitId: string;
      total: string;
      completed: string;
    }>();

    const result: Record<string, number> = {};
    stats.forEach((s) => {
      const total = parseInt(s.total);
      const completed = parseInt(s.completed);
      result[s.habitId] = total > 0 ? Math.round((completed / total) * 100) : 0;
    });

    // ensure all queried habitIds are in the result
    queries.forEach((q) => {
      if (!(q.habitId in result)) result[q.habitId] = 0;
    });

    return result;
  }

  async getMonthlyStats(habitIds: string[]): Promise<Record<string, number>> {
    if (habitIds.length === 0) return {};

    const firstDay = DateUtils.getFirstDayOfMonthDateString();
    const lastDay = DateUtils.getLastDayOfMonthDateString();

    const stats = await this.habitLogRepository
      .createQueryBuilder('log')
      .select('log.habitId', 'habitId')
      .addSelect('COUNT(*)', 'total')
      .addSelect('SUM(CASE WHEN log.status = :status THEN 1 ELSE 0 END)', 'completed')
      .where('log.date BETWEEN :firstDay AND :lastDay', { firstDay, lastDay })
      .andWhere('log.habitId IN (:...habitIds)', { habitIds })
      .setParameter('status', Status.COMPLETED)
      .groupBy('log.habitId')
      .getRawMany<IHabitMonthlyRawStats>();

    const result: Record<string, number> = {};
    stats.forEach((s) => {
      const total = parseInt(s.total);
      const completed = parseInt(s.completed);
      result[s.habitId] = total > 0 ? (completed / total) * 100 : 0;
    });

    habitIds.forEach((id) => {
      if (!(id in result)) result[id] = 0;
    });

    return result;
  }

  async getWeeklyStats(userId: string, analytics: boolean): Promise<IWeekStats> {
    const todayStr = DateUtils.getTodayDateString();
    const sevenDaysAgoStr = DateUtils.getSevenDaysAgoDateString();

    const qb = this.habitLogRepository
      .createQueryBuilder('log')
      .innerJoin('log.habit', 'habit')
      .select('log.date', 'date')
      .where('habit.userId = :userId', { userId })
      .andWhere('log.date BETWEEN :start AND :end', {
        start: sevenDaysAgoStr,
        end: todayStr,
      })
      .groupBy('log.date')
      .orderBy('log.date', 'ASC');

    this.addStatsSelection(qb, 'log');

    if (analytics) {
      qb.addSelect(
        'SUM(CASE WHEN log.status IN (:...missedStatuses) THEN 1 ELSE 0 END)',
        'missedCount',
      ).setParameter('missedStatuses', [Status.PENDING, Status.SKIPPED]);
    }

    const statsRaw = await qb.getRawMany<IWeeklyRawStats>();

    const statsLookup = statsRaw.reduce(
      (acc, row) => {
        const dateStr =
          row.date instanceof Date ? row.date.toISOString().split('T')[0] : String(row.date);
        acc[dateStr] = {
          completed: parseInt(row.completedCount) || 0,
          missed: analytics ? parseInt(row.missedCount || '0') || 0 : 0,
        };
        return acc;
      },
      {} as Record<string, { completed: number; missed: number }>,
    );

    const result: IWeekStats = {
      completed: [],
      missed: analytics ? [] : undefined,
    };

    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgoStr);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const stats = statsLookup[dateStr] || { completed: 0, missed: 0 };

      result.completed.push({ date: dateStr, count: stats.completed });
      if (analytics && result.missed) {
        result.missed.push({ date: dateStr, count: stats.missed });
      }
    }

    return result;
  }
}
