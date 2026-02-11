import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async getOwnProfile(myId: string) {
    return this.userRepository.findOne({
      where: { id: myId },
      select: {
        id: true,
        email: true,
        darkMode: true,
        emailNotifications: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
      },
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException('Current password is required');
      }
      if (!user.password) {
        throw new BadRequestException('User has no password');
      }
      const isGood = await bcrypt.compare(dto.currentPassword, user.password);
      if (!isGood) {
        throw new UnauthorizedException('Invalid current password');
      }
      user.password = await bcrypt.hash(dto.newPassword, 10);
    }

    if (dto.email && dto.email !== user.email) {
      const isEmailTaken = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (isEmailTaken) {
        throw new BadRequestException('Email already taken');
      }
    }

    this.userRepository.merge(user, dto);

    await this.userRepository.save(user);
    return { message: 'Profile updated successfully' };
  }
}
