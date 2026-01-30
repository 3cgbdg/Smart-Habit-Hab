import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateHabitDto } from './dto/create-habit.dto';

@Controller('habits')
@UseGuards(AuthGuard('jwt'))
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) { }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateHabitDto) {
    return this.habitsService.create(req.userId, dto);
  }

  @Get("my")
  async findAll(@Req() req: any) {
    return this.habitsService.findMyHabits(req.userId);
  }

  @Get("relevant")
  async findRelevant(@Req() req: any) {
    return this.habitsService.findRelevantHabits(req.userId);
  }


  @Get('stats/weekly')
  async getWeeklyStats(@Req() req: any) {
    return this.habitsService.getWeeklyStats(req.userId);
  }
}
