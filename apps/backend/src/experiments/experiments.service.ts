import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experiment } from './entities/experiments.entity';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { IReturnMessage, ReturnDataType } from 'src/types/common';
import { EXPERIMENT_CONSTANTS } from '../constants/experiments';

import { AnalysisService } from 'src/analysis/analysis.service';
import { DateUtils } from 'src/utils/date.util';
import { AnalyticsUtils } from 'src/utils/analytics.util';

@Injectable()
export class ExperimentsService {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,
    private readonly analysisService: AnalysisService,
  ) {}

  async createExperiment(
    userId: string,
    dto: CreateExperimentDto,
  ): Promise<IReturnMessage> {
    const experiment = this.experimentRepository.create({
      ...dto,
      userId: userId,
    });
    await this.experimentRepository.save(experiment);
    return { message: 'Successfully created experiment' };
  }

  async findMyExperiments(
    userId: string,
    page: number,
    itemsPerPage: number,
    analytics: boolean,
  ): Promise<ReturnDataType<{ data: Experiment[]; total: number }>> {
    const limit = !analytics
      ? EXPERIMENT_CONSTANTS.MAX_LIMIT < itemsPerPage
        ? EXPERIMENT_CONSTANTS.MAX_LIMIT
        : itemsPerPage
      : EXPERIMENT_CONSTANTS.MAX_ANALYTICS_LIMIT < itemsPerPage
        ? EXPERIMENT_CONSTANTS.MAX_ANALYTICS_LIMIT
        : itemsPerPage;
    const [experiments, total] = await this.experimentRepository.findAndCount({
      where: { userId: userId },
      relations: ['habit'],
      skip: (page - 1) * itemsPerPage,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const today = DateUtils.getTodayDateString();

    const successRatesQueries = experiments.map((exp) => ({
      habitId: exp.habitId,
      startDate: exp.startDate,
      endDate: exp.endDate || today,
    }));

    const successRates =
      await this.analysisService.getBulkSuccessRates(successRatesQueries);

    const dataWithSuccessRate = experiments.map((exp) => {
      const successRate = successRates[exp.habitId] || 0;
      return {
        ...exp,
        successRate,
        ...(analytics && {
          consistencyBoost:
            AnalyticsUtils.calculatePlaceholderConsistencyBoost(),
        }),
      };
    });
    return { data: { data: dataWithSuccessRate, total } };
  }

  async findLatestExperiments(
    userId: string,
    limit: number,
  ): Promise<ReturnDataType<(Experiment & { duration: number })[]>> {
    const experiments = await this.experimentRepository
      .createQueryBuilder('experiment')
      .select([
        'experiment.id AS id',
        'experiment.name AS name',
        `ABS(DATE_PART('day', "experiment"."startDate"::timestamp - CURRENT_DATE::timestamp)) AS duration`,
      ])
      .where('experiment.userId = :userId', { userId })
      .orderBy('experiment.createdAt', 'DESC')
      .take(limit)
      .getRawMany<{ id: string; name: string; duration: number }>();

    return { data: experiments as (Experiment & { duration: number })[] };
  }

  async findOne(
    userId: string,
    id: string,
  ): Promise<ReturnDataType<Experiment & { successRate: number }>> {
    const experiment = await this.experimentRepository
      .createQueryBuilder('experiment')
      .innerJoinAndSelect('experiment.habit', 'habit')
      .select([
        'experiment.id',
        'experiment.name',
        'experiment.variable',
        'experiment.startDate',
        'experiment.endDate',
        'experiment.status',
        'experiment.habitId',
        'habit.id',
        'habit.name',
      ])
      .where('experiment.userId = :userId', { userId })
      .andWhere('experiment.id = :id', { id })
      .getOne();

    if (!experiment) throw new NotFoundException('Experiment not found');

    const today = DateUtils.getTodayDateString();
    const endDate = experiment.endDate || today;

    const successRate = await this.analysisService.getSuccessRate(
      experiment.habitId,
      experiment.startDate,
      endDate,
    );

    return {
      data: {
        ...experiment,
        successRate,
      } as Experiment & { successRate: number },
    };
  }

  async update(
    userId: string,
    id: string,
    dto: CreateExperimentDto,
  ): Promise<IReturnMessage> {
    const experiment = await this.experimentRepository.findOne({
      where: { id, userId },
    });

    if (!experiment) throw new NotFoundException('Experiment not found');

    // combining our experminent with dto data we want to update
    Object.assign(experiment, dto);
    await this.experimentRepository.save(experiment);
    return { message: 'Successfully updated experiment' };
  }

  async remove(userId: string, id: string): Promise<IReturnMessage> {
    const experiment = await this.experimentRepository.findOne({
      where: { id, userId },
    });

    if (!experiment) throw new NotFoundException('Experiment not found');

    await this.experimentRepository.remove(experiment);
    return { message: 'Successfully deleted experiment' };
  }
}
