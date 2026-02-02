import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiments.entity';
import { ExperimentsService } from './experiments.service';
import { ExperimentsController } from './experiments.controller';
import { HabitLogsModule } from 'src/habit_logs/habit_logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment]), HabitLogsModule],
  controllers: [ExperimentsController],
  providers: [ExperimentsService],
})
export class ExperimentsModule {}
