import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experiment } from './entities/experiments.entity';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { IReturnMessage, ReturnDataType } from 'src/types/common';

@Injectable()
export class ExperimentsService {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,
  ) { }

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
  ): Promise<ReturnDataType<Experiment[]>> {
    const [experiments, total] = await this.experimentRepository.findAndCount({
      where: { userId: userId },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      order: { createdAt: 'DESC' },
    });
    return { data: experiments, total };
  }

  async findOne(
    userId: string,
    id: string,
  ): Promise<ReturnDataType<Experiment>> {
    const experiment = await this.experimentRepository.findOne({
      where: { id, userId: userId },
    });
    if (!experiment) throw new NotFoundException('Experiment not found');
    return { data: experiment };
  }

  async update(
    userId: string,
    id: string,
    dto: CreateExperimentDto,
  ): Promise<IReturnMessage> {
    const experiment = await this.findOne(userId, id);
    // combining our experminent with dto data we want to update
    Object.assign(experiment.data, dto);
    await this.experimentRepository.save(experiment.data);
    return { message: 'Successfully updated experiment' };
  }

  async remove(userId: string, id: string): Promise<IReturnMessage> {
    const experiment = await this.findOne(userId, id);
    await this.experimentRepository.remove(experiment.data);
    return { message: 'Successfully deleted experiment' };
  }
}
