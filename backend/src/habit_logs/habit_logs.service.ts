import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HabitLog, Status } from './entities/habit_log.enitity';
import { EntityManager, Repository } from 'typeorm';
import { IWeekStats } from 'src/types/habits';

interface IHabitMonthlyRawStats {
  habitId: string;
  total: string;
  completed: string;
}

interface IWeeklyRawStats {
  date: Date;
  completedCount: string;
  missedCount?: string;
}

@Injectable()
export class HabitLogsService {
  constructor(
    @InjectRepository(HabitLog)
    private readonly habitLogRepository: Repository<HabitLog>,
  ) {}

  // create habit log
  async create(habitId: string, date: string, status: Status) {
    const habitLog = this.habitLogRepository.create({
      habitId,
      date,
      status,
    });
    return this.habitLogRepository.save(habitLog);
  }

  // optmized bulk create habit logs
  async createBulk(logs: Partial<HabitLog>[]): Promise<void> {
    await this.habitLogRepository.insert(logs);
    return;
  }

  // set status to completed
  async completeLog(habitId: string, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(HabitLog)
      : this.habitLogRepository;
    const today = new Date().toISOString().split('T')[0];
    const existing = await repo.findOne({
      where: { habitId, date: today },
    });

    if (existing) {
      if (existing.status === Status.COMPLETED) return true;
      existing.status = Status.COMPLETED;
      await repo.save(existing);
      return true;
    }

    await repo.save({
      habitId,
      date: today,
      status: Status.COMPLETED,
    });
    return true;
  }

  // skip habit log
  async skipLog(habitId: string, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(HabitLog)
      : this.habitLogRepository;
    const today = new Date().toISOString().split('T')[0];
    const existing = await repo.findOne({
      where: { habitId, date: today },
    });

    if (existing) {
      if (existing.status === Status.SKIPPED) return true;
      existing.status = Status.SKIPPED;
      await repo.save(existing);
      return true;
    }

    await repo.save({
      habitId,
      date: today,
      status: Status.SKIPPED,
    });
    return true;
  }

  async getSuccessRate(
    habitId: string,
    startDate: string,
    endDate: string,
  ): Promise<number> {
    const logs: { total: string; completed: string } | undefined =
      await this.habitLogRepository
        .createQueryBuilder('log')
        .where('log.habitId = :habitId', { habitId })
        .select([
          'count(*) as total',
          'sum(CASE WHEN log.status = :completed THEN 1 ELSE 0 END) as completed',
        ])
        .andWhere('log.date BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .setParameter('completed', Status.COMPLETED)
        .getRawOne();

    const total = Number(logs?.total as string);
    const completed = Number(logs?.completed as string);
    if (total === 0) return 0;

    return Math.round((completed / total) * 100);
  }

  // completion rate per month for multiple habits
  async getMonthlyStats(habitIds: string[]) {
    if (habitIds.length === 0) return {};

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    )
      .toISOString()
      .split('T')[0];

    const stats = await this.habitLogRepository
      .createQueryBuilder('habit_log')
      .select('habit_log.habitId', 'habitId')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        'SUM(CASE WHEN habit_log.status = :status THEN 1 ELSE 0 END)',
        'completed',
      )
      .where('habit_log.date BETWEEN :firstDayOfMonth AND :lastDayOfMonth', {
        firstDayOfMonth,
        lastDayOfMonth,
      })
      .andWhere('habit_log.habitId IN (:...habitIds)', { habitIds })
      .setParameter('status', Status.COMPLETED)
      .groupBy('habit_log.habitId')
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

  // weekly stats for multiple habits
  async getWeeklyStats(
    userId: string,
    analytics: boolean,
  ): Promise<IWeekStats> {
    const today = new Date();
    // Get stats for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    const todayDateStr = today.toISOString().split('T')[0];

    // used aggregation in DB for maximum performance
    const qb = this.habitLogRepository
      .createQueryBuilder('log')
      .innerJoin('log.habit', 'habit')
      .select('log.date', 'date')
      .addSelect(
        'SUM(CASE WHEN log.status = :completed THEN 1 ELSE 0 END)',
        'completedCount',
      )
      .where('habit.userId = :userId', { userId })
      .andWhere('log.date BETWEEN :start AND :end', {
        start: sevenDaysAgoStr,
        end: todayDateStr,
      })
      .setParameter('completed', Status.COMPLETED)
      .groupBy('log.date')
      .orderBy('log.date', 'ASC');

    if (analytics) {
      qb.addSelect(
        'SUM(CASE WHEN log.status IN (:...missedStatuses) THEN 1 ELSE 0 END)',
        'missedCount',
      ).setParameter('missedStatuses', [Status.PENDING, Status.SKIPPED]);
    }

    const statsRaw = await qb.getRawMany<IWeeklyRawStats>();

    // map raw stats to a lookup object
    const statsLookup = statsRaw.reduce(
      (acc, row) => {
        acc[row.date.toISOString().split('T')[0]] = {
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
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const stats = statsLookup[dateStr] || { completed: 0, missed: 0 };

      result.completed.push({
        date: dateStr,
        count: stats.completed,
      });

      if (analytics && result.missed) {
        result.missed.push({
          date: dateStr,
          count: stats.missed,
        });
      }
    }

    return result;
  }

  async updateStatuses() {
    // batch processing
    const BATCH_SIZE = 1000;
    const today = new Date().toISOString().split('T')[0];
    while (true) {
      const ids = await this.habitLogRepository
        .createQueryBuilder('log')
        .select('log.id')
        .where('log.date < :today', { today })
        .andWhere('log.status = :status', { status: Status.PENDING })
        .orderBy('log.date', 'ASC')
        .limit(BATCH_SIZE)
        .getRawMany<{ id: string }>();

      if (ids.length === 0) break;

      await this.habitLogRepository
        .createQueryBuilder()
        .update(HabitLog)
        .set({ status: Status.SKIPPED })
        .whereInIds(ids.map((i) => i.id))
        .execute();
    }
  }
}
