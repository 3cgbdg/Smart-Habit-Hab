import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOrCreateGoogleUser(profile: {
    id?: string;
    sub?: string;
    emails?: { value: string }[];
    email?: string;
    name?: { givenName?: string; familyName?: string };
    given_name?: string;
    family_name?: string;
    photos?: { value: string }[];
    picture?: string;
  }): Promise<User> {
    const googleId = profile.id || profile.sub;
    const email = profile.emails?.[0]?.value || profile.email;
    const firstName = profile.name?.givenName || profile.given_name;
    const lastName = profile.name?.familyName || profile.family_name;
    const imageUrl = profile.photos?.[0]?.value || profile.picture;

    console.log('Google Profile Image URL:', imageUrl);

    if (!email) {
      throw new InternalServerErrorException('Google profile must include an email');
    }

    let user = await this.userRepository.findOne({
      where: [{ googleId }, { email }],
    });

    if (!user) {
      user = this.userRepository.create({
        googleId,
        email,
        firstName,
        lastName,
        imageUrl,
      });
      return this.userRepository.save(user);
    }

    if (!user.googleId) {
      Object.assign(user, { googleId, firstName, lastName, imageUrl });
      await this.userRepository.save(user);
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async doesUserExist(userId: string): Promise<boolean> {
    const userExists = await this.userRepository.exists({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    return userExists;
  }
  async findByEmailWithPassword(
    email: string,
  ): Promise<{ password: string | undefined; id: string }> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { password: true, id: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { password: user.password, id: user.id };
  }

  async createAndReturnUserId(email: string, password: string): Promise<string> {
    const user = await this.userRepository.save({
      email,
      password,
    });
    if (!user) {
      throw new InternalServerErrorException();
    }
    return user.id;
  }
}
