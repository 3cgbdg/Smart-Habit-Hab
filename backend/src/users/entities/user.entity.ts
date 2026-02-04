import { Experiment } from 'src/experiments/entities/experiments.entity';
import { Habit } from 'src/habits/entities/habit.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  password: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  darkMode: boolean;

  @Column({ default: true })
  emailNotifications: boolean;

  @OneToMany(() => Habit, (habit) => habit.user)
  habits: Habit[];

  @OneToMany(() => Experiment, (exp) => exp.user)
  experiments: Experiment[];
}
