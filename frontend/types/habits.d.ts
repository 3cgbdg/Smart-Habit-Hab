export interface IHabit {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    streak?: number;
    completionRate?: number;
    isActive?: boolean;
}


export interface IDayStats {
    date: string;
    count: number;
}

export interface IWeekStats {
    completed: IDayStats[];
    missed?: IDayStats[];
}

interface IHabitFormProps {
    mode: 'create' | 'update';
    initialData?: IHabit;
}