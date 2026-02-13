import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { Habit } from 'src/habits/entities/habit.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseAbstractEntity } from 'src/entities/base-abstract.enitity';

export enum ExperimentStatus {
  PLANNED = 'planned',
  RUNNING = 'running',
  FINISHED = 'finished',
}

@Entity('experiments')
@Index('idx_experiments_user_id', ['userId'])
@Index('idx_experiments_habit_id', ['habitId'])
@Index('idx_experiments_status', ['status'])
@Index('idx_experiments_start_date', ['startDate'])
@Index('idx_experiments_end_date', ['endDate'])
export class Experiment extends BaseAbstractEntity {
  @ManyToOne(() => User, (user) => user.experiments, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Habit, (habit) => habit.experiments, {
    onDelete: 'CASCADE',
  })
  habit: Habit;

  @Column({ type: 'uuid' })
  habitId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  variable: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate?: string | null;

  @Column({
    type: 'enum',
    enum: ExperimentStatus,
    default: ExperimentStatus.PLANNED,
  })
  status: ExperimentStatus;
}
