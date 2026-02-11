import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) { }

  async signup(
    dto: GeneralAuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // hashing password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const userId = await this.usersService.createAndReturnUserId(dto.email, hashedPassword);

    const access_token = await this.createTokenForAccess(userId);
    const refresh_token = await this.createTokenForRefresh(userId);
    return { access_token, refresh_token };
  }

  async login(
    dto: GeneralAuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.returnUserPassAndId(dto.email);
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
    const token = await this.jwtService.signAsync({ userId }, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
    return token;
  }

  async createTokenForRefreshWithCheckUser(userId: string): Promise<string> {
    await this.usersService.doesUserExist(userId);
    const token = await this.jwtService.signAsync({ userId });
    return token;
  }


  async findOrCreateGoogleUser(profile: any): Promise<User> {
    const user = await this.usersService.findOrCreateGoogleUser(profile);
    return user;
  }


  async getJwtPayloadFromRefreshToken(refreshToken: string): Promise<JwtPayload> {
    const decode = this.jwtService.decode(refreshToken);
    if (!decode) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
    return decode as JwtPayload;
  }

  async verifyGoogleToken(token: string): Promise<any> {
    const client = new (await import('google-auth-library')).OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
      return ticket.getPayload();
    } catch (error) {
      console.error('Google token verification failed:', error);
      throw new HttpException('Invalid Google token', HttpStatus.UNAUTHORIZED);
    }
  }
}
