import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { Repository } from 'typeorm';
import { CreateHabitDto } from './dto/create-habit.dto';
import { HabitLogsService } from 'src/habit_logs/habit_logs.service';
import { ReturnDataType } from 'src/types/common';
import { IWeeklyStats } from 'src/types/habits';
import { Status } from 'src/habit_logs/entities/habit_log.enitity';

@Injectable()
export class HabitsService {
    constructor(
        @InjectRepository(Habit)
        private readonly habitRepository: Repository<Habit>,
        private readonly habitLogsService: HabitLogsService
    ) { }

    // creating habit
    async create(userId: string, dto: CreateHabitDto): Promise<ReturnDataType<Habit>> {
        const habit = this.habitRepository.create({
            ...dto,
            userId: userId,
        });
        return { data: await this.habitRepository.save(habit) };
    }

    // getting habits of user with completion rate
    async findMyHabits(userId: string): Promise<ReturnDataType<Habit[]>> {
        const habits = await this.habitRepository.find({
            where: { userId: userId },
            order: { createdAt: 'DESC' },
            select: {
                id: true,
                name: true,
                streak: true,
            }
        });

        const habitIds = habits.map(h => h.id);

        const stats = await this.habitLogsService.getMonthlyStats(habitIds);
        const returnData = habits.map(h => ({
            ...h,
            completionRate: stats[h.id],
        }));

        return { data: returnData };
    }

    // find habits that are relevant to user for the day
    async findRelevantHabits(userId: string): Promise<ReturnDataType<Habit[]>> {


        const data = await this.habitRepository.createQueryBuilder('habit')
            .leftJoin('habit.logs', 'log')
            .select(['habit.id', 'habit.name', 'habit.streak'])
            .where('habit.userId = :userId', { userId })
            .andWhere('habit.isActive = :isActive', { isActive: true })
            .andWhere('(log.id IS NULL OR log.status = :status)', { status: Status.PENDING })
            .getMany();
        
        return { data };
    }

    // weekly stats for all habits of user 
    async getWeeklyStats(userId: string): Promise<ReturnDataType<IWeeklyStats[]>> {
        const habits = await this.habitRepository.find({
            where: { userId: userId },
        });

        if (habits.length === 0) return { data: [] };

        const habitIds = habits.map(h => h.id);

        const stats = await this.habitLogsService.getWeeklyStats(habitIds);

        return { data: stats };
    }



    async completeHabit(userId: string, habitId: string): Promise<ReturnDataType<null>> {
        const isGood = await this.habitLogsService.completeLog(habitId);
        if (isGood) {
            await this.habitRepository.increment({ id: habitId }, 'streak', 1);
        }
        return { data: null };
    }

    async skipHabit(userId: string, habitId: string): Promise<ReturnDataType<null>> {
        const isGood = await this.habitLogsService.skipLog(habitId);
        if (isGood) {
            await this.habitRepository.update({ id: habitId }, { streak: 0 });
        }
        return { data: null };
    }
}
