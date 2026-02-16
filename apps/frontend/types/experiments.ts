export const ExperimentStatus = {
  PLANNED: 'planned',
  RUNNING: 'running',
  FINISHED: 'finished',
} as const;

export type ExperimentStatus = (typeof ExperimentStatus)[keyof typeof ExperimentStatus];

export interface Experiment {
  id: string;
  name: string;
  habitId?: string;
  habit?: {
    id: string;
    name: string;
  };
  variable?: string;
  startDate?: string;
  endDate?: string;
  status?: ExperimentStatus;
  successRate?: number;
  duration?: number;
  consistencyBoost?: number;
}

export interface ExperimentFormProps {
  mode: 'create' | 'update';
  initialData?: Experiment;
  onSuccess: () => void;
}
