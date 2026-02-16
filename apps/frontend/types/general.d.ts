export type ApiResponse<T> = {
  success: boolean;
  status?: string | null;
  data?: T;
  message?: string;
  errors?: string[];
};

export interface UpdateProfilePayload {
  email?: string;
  newPassword?: string;
  currentPassword?: string;
  darkMode?: boolean;
  emailNotifications?: boolean;
}
