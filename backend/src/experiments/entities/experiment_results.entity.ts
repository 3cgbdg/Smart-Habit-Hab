import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Experiment } from './experiments.entity';

@Entity('experiment_results')
@Unique(['experimentId', 'date'])
export class ExperimentResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Experiment, (experiment) => experiment.results, {
    onDelete: 'CASCADE',
  })
  experiment: Experiment;

  @Column({ type: 'uuid' })
  experimentId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'boolean' })
  success: boolean;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt: Date;
}
