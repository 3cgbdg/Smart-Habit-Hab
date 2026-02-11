import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { MoreThan, Repository } from 'typeorm';
import { CreateHabitDto } from './dto/create-habit.dto';
import { HabitLogsService } from 'src/habit_logs/habit_logs.service';
import { ReturnDataType } from 'src/types/common';
import { IWeekStats } from 'src/types/habits';
import { Status } from 'src/habit_logs/entities/habit_log.enitity';
import { AnalysisService } from 'src/analysis/analysis.service';
import { OPTIMIZATION_CONSTANTS } from 'src/constants/optimization';
import { DateUtils } from 'src/utils/date.util';
import { BatchUtils } from 'src/utils/batch.util';
import { PaginationUtils } from 'src/utils/pagination.util';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
    private readonly habitLogsService: HabitLogsService,
    private readonly analysisService: AnalysisService,
  ) { }

  // creating habit
  async create(
    userId: string,
    dto: CreateHabitDto,
  ): Promise<ReturnDataType<Habit>> {
    const habit = this.habitRepository.create({
      ...dto,
      userId: userId,
    });
    return { data: await this.habitRepository.save(habit) };
  }

  // getting habits of user with completion rate
  async findMyHabits(
    userId: string,
    page: number,
    itemsPerPage: number,
    sortBy: string = 'createdAt',
    order: 'ASC' | 'DESC' | undefined = 'DESC',
  ): Promise<ReturnDataType<{ habits: Habit[]; total: number }>> {
    const qb = this.habitRepository
      .createQueryBuilder('habit')
      .where('habit.userId = :userId', { userId })
      .select(['habit.id', 'habit.name', 'habit.createdAt', 'habit.streak'])
      .orderBy(`habit.${sortBy}`, order);

    const { items: habits, total } = await PaginationUtils.paginate(qb, page, itemsPerPage);

    const habitIds = habits.map((h) => h.id);

    const stats = await this.analysisService.getMonthlyStats(habitIds);
    const returnData = habits.map((h) => ({
      ...h,
      completionRate: stats[h.id],
    }));

    return { data: { habits: returnData, total } };
  }

  // getting havit by id
  async findHabitById(
    userId: string,
    id: string,
  ): Promise<ReturnDataType<Habit>> {
    const habit = await this.getHabitOrThrow(id, userId);
    return { data: habit };
  }

  // find habits that are relevant to user for the day
  async findRelevantHabits(userId: string): Promise<ReturnDataType<Habit[]>> {
    const data = await this.habitRepository
      .createQueryBuilder('habit')
      .leftJoin('habit.logs', 'log')
      .select(['habit.id', 'habit.name', 'habit.streak'])
      .where('habit.userId = :userId', { userId })
      .andWhere('habit.isActive = :isActive', { isActive: true })
      .andWhere('(log.id IS NULL OR log.status = :status)', {
        status: Status.PENDING,
      })
      .getMany();

    return { data };
  }

  // weekly stats for all habits of user
  async getWeeklyStats(
    userId: string,
    analytics: boolean,
  ): Promise<ReturnDataType<IWeekStats>> {
    const stats = await this.analysisService.getWeeklyStats(userId, analytics);

    return { data: stats };
  }

  async completeHabit(habitId: string): Promise<ReturnDataType<null>> {
    const isGood = await this.habitLogsService.completeLog(habitId);
    if (isGood) {
      await this.updateStreak(habitId, 'increment');
    }
    return { data: null };
  }

  async updateStreak(habitId: string, type: 'increment' | 'reset') {
    if (type === 'increment') {
      await this.habitRepository.increment({ id: habitId }, 'streak', 1);
    } else {
      await this.habitRepository.update({ id: habitId }, { streak: 0 });
    }
  }


  async skipHabit(habitId: string): Promise<ReturnDataType<null>> {
    const isGood = await this.habitLogsService.skipLog(habitId);
    if (isGood) {
      await this.updateStreak(habitId, 'reset');
    }
    return { data: null };
  }



  async updateHabit(
    userId: string,
    id: string,
    dto: CreateHabitDto,
  ): Promise<ReturnDataType<Habit>> {
    const habit = await this.getHabitOrThrow(id, userId);

    habit.name = dto.name;
    habit.description = dto.description;

    if (dto.isActive !== undefined) {
      habit.isActive = dto.isActive;
    }

    return { data: await this.habitRepository.save(habit) };
  }

  // CRON for creating  logs
  async createDailyLogs() {
    const today = DateUtils.getTodayDateString();

    await BatchUtils.processInBatches(
      (lastId) => this.habitRepository.find({
        take: OPTIMIZATION_CONSTANTS.BATCH_SIZE,
        where: lastId ? { id: MoreThan(lastId) } : {},
        order: { id: 'ASC' },
      }),
      async (habits) => {
        const habitLogs = habits.map((habit) => ({
          habitId: habit.id,
          date: today,
          status: Status.PENDING,
        }));
        await this.habitLogsService.createBulk(habitLogs);
      }
    );
  }

  async updateLogsStatus() {
    await this.habitLogsService.updateStatuses();
  }

  private async getHabitOrThrow(id: string, userId: string): Promise<Habit> {
    const habit = await this.habitRepository.findOne({ where: { id, userId } });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }
    return habit;
  }
}
