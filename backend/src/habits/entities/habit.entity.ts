import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { HabitLog } from '../../habit_logs/entities/habit_log.enitity';
import { Experiment } from 'src/experiments/entities/experiments.entity';

import { BaseAbstractEntity } from 'src/entities/base-abstract.enitity';

@Entity('habits')
@Unique(['userId', 'name'])
export class Habit extends BaseAbstractEntity {


  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => HabitLog, (log) => log.habit)
  logs: HabitLog[];


  @Column({ default: true })
  isActive: boolean;


  @Column({ default: 0 })
  streak: number;

  @ManyToOne(() => User, (user) => user.habits, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Experiment, (exp) => exp.habit)
  experiments: Experiment[];
}
