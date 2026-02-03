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

export interface IUpdateProfilePayload {
  email?: string;
  newPassword?: string;
  currentPassword?: string;
  darkMode?: boolean;
  emailNotifications?: boolean;
}