import { ApiResponse } from '@/types/general';
import { api } from './axiosInstance';
import { AuthFormData } from '@smart-habit/shared';

class AuthService {
  async logIn(data: AuthFormData): Promise<ApiResponse<null>> {
    const res = await api.post('/auth/login', data);
    return res.data;
  }

  async signUp(data: AuthFormData): Promise<ApiResponse<null>> {
    const res = await api.post('/auth/signup', {
      ...data,
    });
    return res.data;
  }

  async logOut(): Promise<ApiResponse<null>> {
    const res = await api.delete('/auth/logout');
    return res.data;
  }

  async googleLogin(token: string): Promise<ApiResponse<null>> {
    const res = await api.post('/auth/google', { token });
    return res.data;
  }
}

const authService = new AuthService();
export default authService;
