import { ApiResponse } from '@/types/general';
import { api } from './axiosInstance';
import { CreateExperimentInput } from '@smart-habit/shared';
import { IExperiment } from '@/types/experiments';

class ExperimentsService {
  async createExperiment(data: CreateExperimentInput): Promise<ApiResponse<null>> {
    const res = await api.post('/experiments', data);
    return res.data;
  }

  async updateExperiment(id: string, data: CreateExperimentInput): Promise<ApiResponse<null>> {
    const res = await api.patch(`/experiments/${id}`, data);
    return res.data;
  }

  async getMyExperiments(
    page: number,
    itemsPerPage: number,
    analytics?: boolean,
  ): Promise<ApiResponse<{ data: IExperiment[]; total: number }>> {
    const res = await api.get('/experiments', {
      params: {
        page,
        itemsPerPage,
        analytics,
      },
    });
    return res.data;
  }

  async getExperimentById(id: string): Promise<ApiResponse<IExperiment>> {
    const res = await api.get(`/experiments/${id}`);
    return res.data;
  }

  async deleteExperiment(id: string): Promise<ApiResponse<null>> {
    const res = await api.delete(`/experiments/${id}`);
    return res.data;
  }

  async getLatestExperiments(): Promise<ApiResponse<IExperiment[]>> {
    const res = await api.get('/experiments/latest', {
      params: {
        limit: 3,
      },
    });
    return res.data;
  }
}

const experimentsService = new ExperimentsService();
export default experimentsService;
