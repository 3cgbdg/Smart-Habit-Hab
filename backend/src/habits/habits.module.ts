import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Habit } from "./entities/habit.entity";
import { HabitsController } from "./habits.controller";
import { HabitsService } from "./habits.service";
import { HabitLogsModule } from "src/habit_logs/habit_logs.module";
import { HabitCron } from "./habit.cron";
@Module({
  imports: [TypeOrmModule.forFeature([Habit]),
    HabitLogsModule
  ],
  controllers: [HabitsController],
  providers: [HabitsService, HabitCron],
})
export class HabitsModule { }
