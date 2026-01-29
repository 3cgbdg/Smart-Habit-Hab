import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { HabitLog } from "./habit_log.enitity";
import { Experiment } from "src/experiments/entities/experiments.entity";

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => HabitLog, log => log.habit)
  logs: HabitLog[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.habits, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Experiment, exp => exp.habit)
  experiments: Experiment[]
}