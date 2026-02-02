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

export interface IWeeklyStats {
    day: string,
    count: number,
    completed: number,
    missed: number
}

interface IHabitFormProps {
    mode: 'create' | 'update';
    initialData?: IHabit;
}