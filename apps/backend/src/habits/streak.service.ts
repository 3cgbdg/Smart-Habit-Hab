import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StreakService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
  ) {}

  async incrementStreak(habitId: string): Promise<void> {
    await this.habitRepository.increment({ id: habitId }, 'streak', 1);
  }

  async resetStreak(habitId: string): Promise<void> {
    await this.habitRepository.update({ id: habitId }, { streak: 0 });
  }
}
