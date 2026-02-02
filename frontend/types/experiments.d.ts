export enum ExperimentStatus {
    PLANNED = 'planned',
    RUNNING = 'running',
    FINISHED = 'finished',
}

export interface IExperiment {
    id: string;
    name: string;
    habitId: string;
    variable: string;
    startDate: string;
    endDate?: string;
    status: ExperimentStatus;
}

export interface IExperimentFormProps {
    mode: 'create' | 'update';
    initialData?: IExperiment;
    onSuccess: () => void;
}

