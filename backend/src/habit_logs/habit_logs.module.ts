import { Module } from '@nestjs/common';
import { HabitLogsService } from './habit_logs.service';
import { HabitLogsController } from './habit_logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitLog } from './entities/habit_log.enitity';

@Module({
  imports: [TypeOrmModule.forFeature([HabitLog])],
  controllers: [HabitLogsController],
  providers: [HabitLogsService],
  exports: [HabitLogsService]
})
export class HabitLogsModule { }
