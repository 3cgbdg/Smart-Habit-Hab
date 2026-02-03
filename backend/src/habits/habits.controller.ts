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
import { Habit } from './entities/habit.entity';
import type { AuthRequest } from 'src/types/auth';
import { IWeekStats } from 'src/types/habits';

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
    @Query('sortBy') sortBy: string,
    @Query('order') order: 'ASC' | 'DESC' | undefined = 'ASC',
  ): Promise<ReturnDataType<{ habits: Habit[]; total: number }>> {
    return this.habitsService.findMyHabits(
      req.user.id,
      page,
      itemsPerPage,
      sortBy,
      order,
    );
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
    @Query('analytics') analytics: boolean,
  ): Promise<ReturnDataType<IWeekStats>> {
    return this.habitsService.getWeeklyStats(req.user.id, analytics);
  }

  @Get(':id')
  async findHabitById(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ): Promise<ReturnDataType<Habit>> {
    return this.habitsService.findHabitById(req.user.id, id);
  }

  @Patch('/:habitId/complete')
  async completeHabit(
    @Param('habitId') habitId: string,
  ): Promise<ReturnDataType<null>> {
    return this.habitsService.completeHabit(habitId);
  }

  @Patch('/:habitId/skip')
  async skipHabit(
    @Param('habitId') habitId: string,
  ): Promise<ReturnDataType<null>> {
    return this.habitsService.skipHabit(habitId);
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
