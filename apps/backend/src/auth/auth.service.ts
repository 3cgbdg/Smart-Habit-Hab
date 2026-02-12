import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GeneralAuthDto } from './dto/general-auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { JwtPayload } from 'src/types/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async signup(
    dto: GeneralAuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // hashing password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const userId = await this.usersService.createAndReturnUserId(
      dto.email,
      hashedPassword,
    );

    const access_token = await this.createTokenForAccess(userId);
    const refresh_token = await this.createTokenForRefresh(userId);
    return { access_token, refresh_token };
  }

  async login(
    dto: GeneralAuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    const isGood = await bcrypt.compare(dto.password, user.password ?? '');
    if (!isGood) throw new InternalServerErrorException();
    const access_token = await this.createTokenForAccess(user.id);
    const refresh_token = await this.createTokenForRefresh(user.id);
    return { access_token, refresh_token };
  }

  async createTokenForAccess(userId: string): Promise<string> {
    const token = await this.jwtService.signAsync({ userId });
    return token;
  }
  async createTokenForRefresh(userId: string): Promise<string> {
    const token = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
    return token;
  }

  async createTokenForRefreshWithCheckUser(userId: string): Promise<string> {
    await this.usersService.doesUserExist(userId);
    const token = await this.jwtService.signAsync({ userId });
    return token;
  }

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
    const user = await this.usersService.findOrCreateGoogleUser(profile);
    return user;
  }

  getJwtPayloadFromRefreshToken(refreshToken: string): JwtPayload {
    const decode = this.jwtService.decode<JwtPayload>(refreshToken);
    if (!decode) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
    return decode;
  }

  async verifyGoogleToken(token: string): Promise<Record<string, any>> {
    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new HttpException(
          'Invalid Google token',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return payload as unknown as Record<string, unknown>;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Google token verification failed:', error);
      throw new HttpException('Invalid Google token', HttpStatus.UNAUTHORIZED);
    }
  }
}
