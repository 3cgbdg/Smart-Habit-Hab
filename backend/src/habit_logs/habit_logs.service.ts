import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HabitLog } from './entities/habit_log.enitity';
import { Repository } from 'typeorm';

@Injectable()
export class HabitLogsService {
    constructor(@InjectRepository(HabitLog) private readonly habitLogRepository: Repository<HabitLog>) { }

    async create(habitId: string, date: string, completed: boolean) {
        const habitLog = this.habitLogRepository.create({
            habit_id: habitId,
            date,
            completed,
        });
        return this.habitLogRepository.save(habitLog);
    }

    // completion rate per month for multiple habits
    async getMonthlyStats(habitIds: string[]) {
        if (habitIds.length === 0) return {};

        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

        const stats = await this.habitLogRepository.createQueryBuilder('habit_log')
            .select('habit_log.habit_id', 'habitId')
            .addSelect('COUNT(*)', 'total')
            .addSelect('SUM(CASE WHEN habit_log.completed = true THEN 1 ELSE 0 END)', 'completed')
            .where('habit_log.date BETWEEN :firstDayOfMonth AND :lastDayOfMonth', { firstDayOfMonth, lastDayOfMonth })
            .andWhere('habit_log.habit_id IN (:...habitIds)', { habitIds })
            .groupBy('habit_log.habit_id')
            .getRawMany();

        const result: Record<string, number> = {};
        stats.forEach(s => {
            const total = parseInt(s.total);
            const completed = parseInt(s.completed);
            result[s.habitId] = total > 0 ? (completed / total) * 100 : 0;
        });

        habitIds.forEach(id => {
            if (!(id in result)) result[id] = 0;
        });

        return result;
    }
}
