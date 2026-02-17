import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HabitLog, Status } from './entities/habit_log.enitity';
import { Repository, EntityManager } from 'typeorm';
import { OPTIMIZATION_CONSTANTS } from 'src/constants/optimization';
import { DateUtils } from 'src/utils/date.util';
import { BatchUtils } from 'src/utils/batch.util';

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

  async changeStatus(habitId: string, status: Status, manager?: EntityManager) {
    const log = await this.findOrCreateTodayLog(habitId, manager);

    if (log.status === status) return true;

    log.status = status;
    const repository = manager ? manager.getRepository(HabitLog) : this.habitLogRepository;
    await repository.save(log);

    return true;
  }

  private async findOrCreateTodayLog(habitId: string, manager?: EntityManager): Promise<HabitLog> {
    const repository = manager ? manager.getRepository(HabitLog) : this.habitLogRepository;
    const date = DateUtils.getTodayDateString();

    const existing = await repository.findOne({
      where: { habitId, date },
    });

    if (existing) return existing;

    return repository.create({
      habitId,
      date,
      status: Status.PENDING,
    });
  }

  async ifLogExistsAndReturn(habitId: string, date: string) {
    const existing = await this.habitLogRepository.findOne({
      where: { habitId, date },
    });
    if (!existing) throw new NotFoundException('Log not found');
    return existing;
  }

  // set status to completed
  async completeLog(habitId: string, manager?: EntityManager) {
    await this.changeStatus(habitId, Status.COMPLETED, manager);
    return true;
  }

  // skip habit log
  async skipLog(habitId: string, manager?: EntityManager) {
    await this.changeStatus(habitId, Status.SKIPPED, manager);
    return true;
  }

  async updateStatuses() {
    const today = DateUtils.getTodayDateString();

    await BatchUtils.processRemainingInBatches(
      () =>
        this.habitLogRepository
          .createQueryBuilder('log')
          .select('log.id')
          .where('log.date < :today', { today })
          .andWhere('log.status = :status', { status: Status.PENDING })
          .orderBy('log.date', 'ASC')
          .limit(OPTIMIZATION_CONSTANTS.BATCH_SIZE)
          .getRawMany<{ id: string }>(),
      async (rawIds) => {
        const ids = rawIds.map((i) => i.id);
        await this.habitLogRepository
          .createQueryBuilder()
          .update(HabitLog)
          .set({ status: Status.SKIPPED })
          .whereInIds(ids)
          .execute();
      },
    );
  }
}
