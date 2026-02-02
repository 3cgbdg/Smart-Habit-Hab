export const ExperimentStatus = {
    PLANNED: 'planned',
    RUNNING: 'running',
    FINISHED: 'finished',
} as const;

export type ExperimentStatus =
    typeof ExperimentStatus[keyof typeof ExperimentStatus];


export interface IExperiment {
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
    status: ExperimentStatus;
    successRate?: number;
    duration: number;
}

export interface IExperimentFormProps {
    mode: 'create' | 'update';
    initialData?: IExperiment;
    onSuccess: () => void;
}

