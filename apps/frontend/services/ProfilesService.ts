import { ApiResponse } from '@/types/general';
import { IUser } from '@/types/profiles';
import { api } from './axiosInstance';
import { UpdateProfileInput } from '@smart-habit/shared';

class ProfilesService {
  async getOwnProfile(): Promise<IUser> {
    const response = await api.get('/profiles/me');
    if (!response.data) throw new Error('Profile was not found!');
    return response.data;
  }

  async updateProfile(data: UpdateProfileInput): Promise<ApiResponse<null>> {
    const response = await api.patch('/profiles/update', data);
    return response.data;
  }
}

const profilesService = new ProfilesService();
export default profilesService;
