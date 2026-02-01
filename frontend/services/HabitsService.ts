import { ApiResponse } from "@/types/general";
import { api } from "./axiosInstance";
import { IHabit, IWeeklyStats } from "@/types/habits";

export class HabitsService {
    async getRelevantHabits(): Promise<ApiResponse<IHabit[]>> {
        const response = await api.get('/habits/relevant');
        return response.data;
    }

    async getWeeklyStats(): Promise<ApiResponse<IWeeklyStats[]>> {
        const response = await api.get('/habits/stats/weekly');
        return response.data;
    }

    async completeHabit(habitId: string): Promise<ApiResponse<null>> {
        const response = await api.patch(`/habits/${habitId}/complete`);
        return response.data;
    }

    async skipHabit(habitId: string): Promise<ApiResponse<null>> {
        const response = await api.patch(`/habits/${habitId}/skip`);
        return response.data;
    }

    async getMyHabits(page: number, itemsPerPage: number): Promise<ApiResponse<{ habits: IHabit[], total: number }>> {
        const response = await api.get('/habits/my', {
            params: {
                page,
                itemsPerPage
            }
        });
        return response.data;
    }

    async getHabitById(habitId: string): Promise<ApiResponse<IHabit>> {
        const response = await api.get(`/habits/${habitId}`);
        return response.data;
    }

    async createHabit(data: { name: string, description?: string, isActive?: boolean }): Promise<ApiResponse<null>> {
        const response = await api.post('/habits', data);
        return response.data;
    }

    async updateHabit(id: string, data: { name: string, description?: string, isActive?: boolean }): Promise<ApiResponse<null>> {
        const response = await api.patch(`/habits/${id}`, data);
        return response.data;
    }
}

const habitsService = new HabitsService();
export default habitsService;