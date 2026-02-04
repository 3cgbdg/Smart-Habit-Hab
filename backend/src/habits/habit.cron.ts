// habit-logs.cron.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HabitsService } from './habits.service';

@Injectable()
export class HabitCron {
  constructor(private readonly habitsService: HabitsService) {}

  // execute at 12:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyLogs() {
    await this.habitsService.createDailyLogs();
  }
  // execute at 1:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async updateLogsStatus() {
    await this.habitsService.updateLogsStatus();
  }
}
