import { ApiResponse, IUser } from "@/types/general";
import { api } from "./axiosInstance";
import { AuthFormData } from "@/validation/AuthFormSchema";

class ProfilesService {

  async getOwnProfile(): Promise<IUser> {
    const response = await api.get("/profile");
    if (!response.data)
      throw new Error("Profile was not found!");
    return response.data;
  }

}



const profilesService = new ProfilesService();
export default profilesService;