export interface IHabit {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    streak?: number;
    completionRate?: number;
}

export interface IWeeklyStats {
    day: string,
    count: number
}