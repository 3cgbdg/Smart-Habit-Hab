import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HabitLog, Status } from './entities/habit_log.enitity';
import { Repository } from 'typeorm';
import { OPTIMIZATION_CONSTANTS } from 'src/constants/optimization';
import { DateUtils } from 'src/utils/date.util';


@Injectable()
export class HabitLogsService {
  constructor(
    @InjectRepository(HabitLog)
    private readonly habitLogRepository: Repository<HabitLog>,
  ) { }

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

  async changeStatus(habitId: string, status: Status) {
    const date = DateUtils.getTodayDateString();
    let log = await this.habitLogRepository.findOne({
      where: { habitId, date },
    });

    if (log) {
      if (log.status === status) return true;
      log.status = status;
    } else {
      log = this.habitLogRepository.create({
        habitId,
        date,
        status,
      });
    }

    await this.habitLogRepository.save(log);
    return true;
  }

  async ifLogExistsAndReturn(habitId: string, date: string) {
    const existing = await this.habitLogRepository.findOne({
      where: { habitId, date },
    });
    if (!existing) throw new NotFoundException('Log not found');
    return existing;
  }

  // set status to completed
  async completeLog(habitId: string) {
    await this.changeStatus(habitId, Status.COMPLETED);
    return true;
  }

  // skip habit log
  async skipLog(habitId: string) {
    await this.changeStatus(habitId, Status.SKIPPED);
    return true;
  }

  async updateStatuses() {
    // batch processing
    const today = DateUtils.getTodayDateString();
    while (true) {
      const ids = await this.habitLogRepository
        .createQueryBuilder('log')
        .select('log.id')
        .where('log.date < :today', { today })
        .andWhere('log.status = :status', { status: Status.PENDING })
        .orderBy('log.date', 'ASC')
        .limit(OPTIMIZATION_CONSTANTS.BATCH_SIZE)
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
