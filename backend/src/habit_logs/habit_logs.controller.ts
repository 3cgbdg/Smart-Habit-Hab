import { Controller } from '@nestjs/common';
import { HabitLogsService } from './habit_logs.service';

@Controller('habit-logs')
export class HabitLogsController {
  constructor(private readonly habitLogsService: HabitLogsService) {}
}
