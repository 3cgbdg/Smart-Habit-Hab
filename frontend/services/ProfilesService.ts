import { ApiResponse, IUser } from "@/types/general";
import { api } from "./axiosInstance";

class ProfilesService {

  async getOwnProfile(): Promise<IUser> {
    const response = await api.get("/profiles/me");
    if (!response.data)
      throw new Error("Profile was not found!");
    return response.data;
  }

  async updateProfile(data: Partial<IUser> & { currentPassword?: string; newPassword?: string }): Promise<ApiResponse<null>> {
    const response = await api.patch("/profiles/update", data);
    return response.data;
  }

}

const profilesService = new ProfilesService();
export default profilesService;