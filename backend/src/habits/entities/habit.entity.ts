import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { HabitLog } from '../../habit_logs/entities/habit_log.enitity';
import { Experiment } from 'src/experiments/entities/experiments.entity';

@Entity('habits')
@Unique(['userId', 'name'])
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => HabitLog, (log) => log.habit)
  logs: HabitLog[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 0 })
  streak: number;

  @ManyToOne(() => User, (user) => user.habits, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Experiment, (exp) => exp.habit)
  experiments: Experiment[];
}
