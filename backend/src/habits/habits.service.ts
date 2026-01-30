import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { Between, In, Repository } from 'typeorm';
import { HabitLog } from '../habit_logs/entities/habit_log.enitity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { HabitLogsService } from 'src/habit_logs/habit_logs.service';

@Injectable()
export class HabitsService {
    constructor(
        @InjectRepository(Habit)
        private readonly habitRepository: Repository<Habit>,
        @InjectRepository(HabitLog)
        private readonly habitLogRepository: Repository<HabitLog>,
        private readonly habitLogsService: HabitLogsService
    ) { }

    // creating habit
    async create(userId: string, dto: CreateHabitDto): Promise<Habit> {
        const habit = this.habitRepository.create({
            ...dto,
            user_id: userId,
        });
        return this.habitRepository.save(habit);
    }

    // getting habits of user with completion rate
    async findMyHabits(userId: string) {
        const habits = await this.habitRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
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

        return returnData;
    }

    // find habits that are relevant to user for the day
    async findRelevantHabits(userId: string) {
        const habits = await this.habitRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
            select: {
                id: true,
                name: true,
                streak: true,
            }
        });

        return habits;
    }

    // weekly stats for all habits of user 
    async getWeeklyStats(userId: string) {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const startOfWeek = new Date(today.setDate(diff));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const habits = await this.habitRepository.find({
            where: { user_id: userId },
        });

        if (habits.length === 0) return [];

        const habitIds = habits.map(h => h.id);


        const logs = await this.habitLogRepository.find({
            where: {
                habit_id: In(habitIds),
                date: Between(
                    startOfWeek.toISOString().split('T')[0],
                    endOfWeek.toISOString().split('T')[0]
                ),
            },
        });

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const stats = days.map(day => ({ day, count: 0 }));

        logs.forEach(log => {
            const date = new Date(log.date);
            let dayIndex = date.getDay() - 1;
            if (dayIndex === -1) dayIndex = 6;
            if (stats[dayIndex]) {
                stats[dayIndex].count++;
            }
        });

        return stats;
    }



}
