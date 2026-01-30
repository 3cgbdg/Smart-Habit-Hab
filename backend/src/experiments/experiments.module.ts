import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiments.entity';
import { ExperimentResult } from './entities/experiment_results.entity';
import { ExperimentsService } from './experiments.service';
import { ExperimentsController } from './experiments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment, ExperimentResult])],
  controllers: [ExperimentsController],
  providers: [ExperimentsService],
})
export class ExperimentsModule { }
