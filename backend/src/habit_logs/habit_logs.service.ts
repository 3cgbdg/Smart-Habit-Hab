import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HabitLog, Status } from './entities/habit_log.enitity';
import { Between, In, Repository } from 'typeorm';
import { IWeeklyStats } from 'src/types/habits';

@Injectable()
export class HabitLogsService {
    constructor(@InjectRepository(HabitLog) private readonly habitLogRepository: Repository<HabitLog>) { }

    // create habit log
    async create(habitId: string, date: string, status: Status) {
        const habitLog = this.habitLogRepository.create({
            habitId,
            date,
            status,
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
            .select('habit_log.habitId', 'habitId')
            .addSelect('COUNT(*)', 'total')
            .addSelect('SUM(CASE WHEN habit_log.status = :status THEN 1 ELSE 0 END)', 'completed')
            .where('habit_log.date BETWEEN :firstDayOfMonth AND :lastDayOfMonth', { firstDayOfMonth, lastDayOfMonth })
            .andWhere('habit_log.habitId IN (:...habitIds)', { habitIds })
            .setParameter('status', Status.COMPLETED)
            .groupBy('habit_log.habitId')
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

    // weekly stats for multiple habits
    async getWeeklyStats(habitIds: string[]): Promise<IWeeklyStats[]> {

        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const startOfWeek = new Date(today.setDate(diff));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const logs = await this.habitLogRepository.find({
            where: {
                habitId: In(habitIds),
                status: Status.COMPLETED,
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


    // set status to completed
    async completeLog(habitId: string) {
        const today = new Date().toISOString().split('T')[0];
        const existing = await this.habitLogRepository.findOne({
            where: { habitId, date: today },
        });

        if (existing) {
            if (existing.status === Status.COMPLETED) return true;
            existing.status = Status.COMPLETED;
            await this.habitLogRepository.save(existing);
            return true;
        }

        await this.habitLogRepository.save({
            habitId,
            date: today,
            status: Status.COMPLETED,
        });
        return true;
    }

    // skip habit log
    async skipLog(habitId: string) {
        const today = new Date().toISOString().split('T')[0];
        const existing = await this.habitLogRepository.findOne({
            where: { habitId, date: today },
        });

        if (existing) {
            if (existing.status === Status.SKIPPED) return true;
            existing.status = Status.SKIPPED;
            await this.habitLogRepository.save(existing);
            return true;
        }

        await this.habitLogRepository.save({
            habitId,
            date: today,
            status: Status.SKIPPED,
        });
        return true;
    }

}


