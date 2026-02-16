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
import { StreakService } from './streak.service';
import { HABIT_SELECT_FIELDS, HABIT_RELEVANT_SELECT_FIELDS } from './habits.constants';
import { GetHabitResponseDto } from './dto/get-habit-response.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
    private readonly habitLogsService: HabitLogsService,
    private readonly analysisService: AnalysisService,
    private readonly streakService: StreakService,
  ) {}

  async create(userId: string, dto: CreateHabitDto): Promise<ReturnDataType<GetHabitResponseDto>> {
    const habit = this.habitRepository.create({
      ...dto,
      userId: userId,
    });
    const savedHabit = await this.habitRepository.save(habit);
    return { data: savedHabit as GetHabitResponseDto };
  }

  async findMyHabits(
    userId: string,
    page: number,
    itemsPerPage: number,
    sortBy: string = 'createdAt',
    order: 'ASC' | 'DESC' | undefined = 'DESC',
  ): Promise<ReturnDataType<{ habits: GetHabitResponseDto[]; total: number }>> {
    const qb = this.habitRepository
      .createQueryBuilder('habit')
      .where('habit.userId = :userId', { userId })
      .select(HABIT_SELECT_FIELDS)
      .orderBy(`habit.${sortBy}`, order);

    const { items: habits, total } = await PaginationUtils.paginate(qb, page, itemsPerPage);

    const habitIds = habits.map((h) => h.id);

    const stats = await this.analysisService.getMonthlyStats(habitIds);
    const returnData = habits.map(
      (h) => ({ ...h, completionRate: stats[h.id] }) as GetHabitResponseDto,
    );

    return { data: { habits: returnData, total } };
  }

  async findHabitById(userId: string, id: string): Promise<ReturnDataType<GetHabitResponseDto>> {
    const habit = await this.getHabitOrThrow(id, userId);
    return { data: habit as GetHabitResponseDto };
  }

  async findRelevantHabits(userId: string): Promise<ReturnDataType<GetHabitResponseDto[]>> {
    const data = await this.habitRepository
      .createQueryBuilder('habit')
      .leftJoin('habit.logs', 'log')
      .select(HABIT_RELEVANT_SELECT_FIELDS)
      .where('habit.userId = :userId', { userId })
      .andWhere('habit.isActive = :isActive', { isActive: true })
      .andWhere('(log.id IS NULL OR log.status = :status)', {
        status: Status.PENDING,
      })
      .getMany();

    return { data: data as GetHabitResponseDto[] };
  }

  async getWeeklyStats(userId: string, analytics: boolean): Promise<ReturnDataType<IWeekStats>> {
    const stats = await this.analysisService.getWeeklyStats(userId, analytics);

    return { data: stats };
  }

  async completeHabit(habitId: string): Promise<ReturnDataType<null>> {
    const isSuccess = await this.habitLogsService.completeLog(habitId);
    if (isSuccess) {
      await this.streakService.incrementStreak(habitId);
    }
    return { data: null };
  }

  async skipHabit(habitId: string): Promise<ReturnDataType<null>> {
    const isSuccess = await this.habitLogsService.skipLog(habitId);
    if (isSuccess) {
      await this.streakService.resetStreak(habitId);
    }
    return { data: null };
  }

  async updateHabit(
    userId: string,
    id: string,
    dto: CreateHabitDto,
  ): Promise<ReturnDataType<GetHabitResponseDto>> {
    const habit = await this.getHabitOrThrow(id, userId);

    Object.assign(habit, dto);
    const savedHabit = await this.habitRepository.save(habit);

    return { data: savedHabit as GetHabitResponseDto };
  }

  async createDailyLogs() {
    const today = DateUtils.getTodayDateString();

    await BatchUtils.processInBatches(
      (lastId) =>
        this.habitRepository.find({
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
      },
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
