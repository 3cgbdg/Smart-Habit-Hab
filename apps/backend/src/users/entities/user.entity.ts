import { Entity, Column, OneToMany } from 'typeorm';
import { BaseAbstractEntity } from 'src/entities/base-abstract.enitity';
import { Habit } from 'src/habits/entities/habit.entity';
import { Experiment } from 'src/experiments/entities/experiments.entity';

@Entity({ name: 'users' })
export class User extends BaseAbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false, nullable: true })
  password?: string;

  @Column({ unique: true, nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: false })
  darkMode: boolean;

  @Column({ default: true })
  emailNotifications: boolean;

  @OneToMany(() => Habit, (habit) => habit.user)
  habits: Habit[];

  @OneToMany(() => Experiment, (exp) => exp.user)
  experiments: Experiment[];
}
