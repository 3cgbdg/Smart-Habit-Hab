import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ExperimentsService } from './experiments.service';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { AuthGuard } from '@nestjs/passport';
import type { AuthRequest } from 'src/types/auth';
import { Experiment } from './entities/experiments.entity';
import { ReturnDataType, IReturnMessage } from 'src/types/common';

@Controller('experiments')
@UseGuards(AuthGuard('jwt'))
export class ExperimentsController {
  constructor(private readonly experimentsService: ExperimentsService) { }

  @Post()
  async createExperiment(
    @Req() req: AuthRequest,
    @Body() dto: CreateExperimentDto,
  ): Promise<IReturnMessage> {
    return this.experimentsService.createExperiment(req.user.id, dto);
  }

  @Get()
  async findMyExperiments(
    @Req() req: AuthRequest,
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
  ): Promise<ReturnDataType<Experiment[]>> {
    return this.experimentsService.findMyExperiments(
      req.user.id,
      page,
      itemsPerPage,
    );
  }

  @Get(':id')
  async findOne(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ): Promise<ReturnDataType<Experiment>> {
    return this.experimentsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: CreateExperimentDto,
  ): Promise<IReturnMessage> {
    return this.experimentsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  async remove(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ): Promise<IReturnMessage> {
    return this.experimentsService.remove(req.user.id, id);
  }
}
