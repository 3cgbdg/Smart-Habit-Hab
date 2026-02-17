import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class StreakService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
  ) {}

  async incrementStreak(habitId: string, manager?: EntityManager): Promise<void> {
    const repository = manager ? manager.getRepository(Habit) : this.habitRepository;
    await repository.increment({ id: habitId }, 'streak', 1);
  }

  async resetStreak(habitId: string, manager?: EntityManager): Promise<void> {
    const repository = manager ? manager.getRepository(Habit) : this.habitRepository;
    await repository.update({ id: habitId }, { streak: 0 });
  }
}
