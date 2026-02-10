import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experiment } from './entities/experiments.entity';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { IReturnMessage, ReturnDataType } from 'src/types/common';
import { HabitLogsService } from 'src/habit_logs/habit_logs.service';
import { EXPERIMENT_CONSTANTS } from '../constants/experiments';

@Injectable()
export class ExperimentsService {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,
    private readonly habitLogsService: HabitLogsService,
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
  ): Promise<ReturnDataType<{ data: any[]; total: number }>> {
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

    const today = new Date().toISOString().split('T')[0];

    const dataWithSuccessRate = await Promise.all(
      experiments.map(async (exp) => {
        const endDate = exp.endDate || today;
        const successRate = await this.habitLogsService.getSuccessRate(
          exp.habitId,
          exp.startDate,
          endDate,
        );
        return {
          ...exp,
          successRate,
          ...(analytics && {
            consistencyBoost: Math.floor(Math.random() * 15) + 5,
          }),
        };
      }),
    );
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

    const today = new Date().toISOString().split('T')[0];
    const endDate = experiment.endDate || today;

    const successRate = await this.habitLogsService.getSuccessRate(
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
