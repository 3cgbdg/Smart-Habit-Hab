import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Habit } from '../../habits/entities/habit.entity';

export enum Status {
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  PENDING = 'pending',
}

@Entity('habit_logs')
@Unique(['habitId', 'date'])
@Index('idx_habit_logs_habit_id', ['habitId'])
@Index('idx_habit_logs_date', ['date'])
export class HabitLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Habit, (habit) => habit.logs, {
    onDelete: 'CASCADE',
  })
  habit: Habit;

  @Column({ type: 'uuid' })
  habitId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;
}
