export interface IUser {
  id: string;
  email: string;
  darkMode: boolean;
  emailNotifications: boolean;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}
