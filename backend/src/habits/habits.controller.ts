import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateHabitDto } from './dto/create-habit.dto';
import { ReturnDataType } from 'src/types/common';
import { IWeeklyStats } from 'src/types/habits';
import { Habit } from './entities/habit.entity';
import type { AuthRequest } from 'src/types/auth';

@Controller('habits')
@UseGuards(AuthGuard('jwt'))
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  async create(
    @Req() req: AuthRequest,
    @Body() dto: CreateHabitDto,
  ): Promise<ReturnDataType<Habit>> {
    return this.habitsService.create(req.user.id, dto);
  }

  @Get('my')
  async findMyHabits(
    @Req() req: AuthRequest,
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
  ): Promise<ReturnDataType<{ habits: Habit[]; total: number }>> {
    return this.habitsService.findMyHabits(req.user.id, page, itemsPerPage);
  }

  @Get(':id')
  async findHabitById(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ): Promise<ReturnDataType<Habit>> {
    return this.habitsService.findHabitById(req.user.id, id);
  }

  @Get('relevant')
  async findRelevantHabits(
    @Req() req: AuthRequest,
  ): Promise<ReturnDataType<Habit[]>> {
    return this.habitsService.findRelevantHabits(req.user.id);
  }

  @Get('stats/weekly')
  async getWeeklyStats(
    @Req() req: AuthRequest,
  ): Promise<ReturnDataType<IWeeklyStats[]>> {
    return this.habitsService.getWeeklyStats(req.user.id);
  }

  @Patch('/:habitId/complete')
  async completeHabit(
    @Req() req: AuthRequest,
    @Param('habitId') habitId: string,
  ): Promise<ReturnDataType<null>> {
    return this.habitsService.completeHabit(req.user.id, habitId);
  }

  @Patch('/:habitId/skip')
  async skipHabit(
    @Req() req: AuthRequest,
    @Param('habitId') habitId: string,
  ): Promise<ReturnDataType<null>> {
    return this.habitsService.skipHabit(req.user.id, habitId);
  }

  @Patch('/:id')
  async updateHabit(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: CreateHabitDto,
  ): Promise<ReturnDataType<Habit>> {
    return this.habitsService.updateHabit(req.user.id, id, dto);
  }
}
