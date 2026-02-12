import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiments.entity';
import { ExperimentsService } from './experiments.service';
import { ExperimentsController } from './experiments.controller';
import { AnalysisModule } from 'src/analysis/analysis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment]), AnalysisModule],
  controllers: [ExperimentsController],
  providers: [ExperimentsService],
})
export class ExperimentsModule {}
