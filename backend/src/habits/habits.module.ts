import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';
import { HabitLogsModule } from 'src/habit_logs/habit_logs.module';
import { AnalysisModule } from 'src/analysis/analysis.module';
import { HabitCron } from './habit.cron';
import { StreakService } from './streak.service';

@Module({
  imports: [TypeOrmModule.forFeature([Habit]), HabitLogsModule, AnalysisModule],
  controllers: [HabitsController],
  providers: [HabitsService, HabitCron, StreakService],
})
export class HabitsModule { }
