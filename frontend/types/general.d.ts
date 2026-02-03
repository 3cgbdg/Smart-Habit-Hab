export type ApiResponse<T> = {
  success: boolean;
  status?: string | null;
  data?: T;
  message?: string;
  errors?: string[];
};

export interface IUser {
  id: string;
  email: string;
  darkMode: boolean;
  emailNotifications: boolean;
}