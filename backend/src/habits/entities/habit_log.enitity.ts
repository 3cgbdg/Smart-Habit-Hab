import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Habit } from "./habit.entity";

@Entity('habit_logs')
@Unique(['habit_id', 'date'])
export class HabitLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Habit, habit => habit.logs, {
        onDelete: 'CASCADE',
    })
    habit: Habit;

    @Column({ type: 'uuid' })
    habit_id: string;

    @Column({ type: 'date' })
    date: string; 

    @Column({ type: 'boolean', default: true })
    completed: boolean;

    @CreateDateColumn()
    created_at: Date;
}