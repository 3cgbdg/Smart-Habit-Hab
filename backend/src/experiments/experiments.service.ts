import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experiment } from './entities/experiments.entity';
import { CreateExperimentDto } from './dto/create-experiment.dto';

@Injectable()
export class ExperimentsService {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,
  ) {}

  async create(userId: string, dto: CreateExperimentDto) {
    const experiment = this.experimentRepository.create({
      ...dto,
      user_id: userId,
    });
    return await this.experimentRepository.save(experiment);
  }

  async findAll(userId: string) {
    return await this.experimentRepository.find({
      where: { user_id: userId },
      relations: ['habit'],
    });
  }

  async findOne(userId: string, id: string) {
    const experiment = await this.experimentRepository.findOne({
      where: { id, user_id: userId },
      relations: ['habit'],
    });
    if (!experiment) throw new NotFoundException('Experiment not found');
    return experiment;
  }

  async update(userId: string, id: string, dto: CreateExperimentDto) {
    const experiment = await this.findOne(userId, id);
    Object.assign(experiment, dto);
    return await this.experimentRepository.save(experiment);
  }

  async remove(userId: string, id: string) {
    const experiment = await this.findOne(userId, id);
    return await this.experimentRepository.remove(experiment);
  }
}
