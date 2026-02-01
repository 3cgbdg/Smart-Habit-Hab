// habit-logs.cron.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HabitsService } from './habits.service';

@Injectable()
export class HabitCron {
  constructor(private readonly habitsService: HabitsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyLogs() {
    await this.habitsService.createDailyLogs();
  }
}
