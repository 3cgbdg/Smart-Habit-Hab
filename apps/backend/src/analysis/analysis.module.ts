import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitLog } from '../habit_logs/entities/habit_log.enitity';
import { AnalysisService } from './analysis.service';

@Module({
  imports: [TypeOrmModule.forFeature([HabitLog])],
  providers: [AnalysisService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
