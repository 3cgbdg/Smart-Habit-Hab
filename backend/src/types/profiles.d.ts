import { User } from 'src/users/entities/user.entity';

export type ReturnOwnProfile = Pick<User, 'id' | 'email' | 'darkMode' | 'emailNotifications'>;
