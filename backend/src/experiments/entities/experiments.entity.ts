import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Habit } from 'src/habits/entities/habit.entity';
import { User } from 'src/users/entities/user.entity';

export enum ExperimentStatus {
  PLANNED = 'planned',
  RUNNING = 'running',
  FINISHED = 'finished',
}

@Entity('experiments')
export class Experiment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  endDate?: string;

  @Column({
    type: 'enum',
    enum: ExperimentStatus,
    default: ExperimentStatus.PLANNED,
  })
  status: ExperimentStatus;
  
  @CreateDateColumn()
  createdAt: Date;
}
