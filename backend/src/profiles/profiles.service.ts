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
  ) {}

  async getOwnProfile(myId: string) {
    const user = await this.userRepository.findOne({
      where: { id: myId },
      select: {
        id: true,
        email: true,
        darkMode: true,
        emailNotifications: true,
      },
    });
    if (user) {
      return user;
    }
    return null;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check password if sensitive fields are changing
    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException('Current password is required');
      }
      const isGood = await bcrypt.compare(dto.currentPassword, user.password);
      if (!isGood) {
        throw new UnauthorizedException('Invalid current password');
      }
    }

    if (dto.email && dto.email !== user.email) {
      const isEmailTaken = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (isEmailTaken) {
        throw new BadRequestException('Email already taken');
      }
      user.email = dto.email;
    }

    if (dto.newPassword) {
      user.password = await bcrypt.hash(dto.newPassword, 10);
    }

    if (dto.darkMode !== undefined) {
      user.darkMode = dto.darkMode;
    }

    if (dto.emailNotifications !== undefined) {
      user.emailNotifications = dto.emailNotifications;
    }
    await this.userRepository.save(user);
    return { message: 'Profile updated successfully' };
  }
}
