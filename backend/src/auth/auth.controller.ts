import {
  Controller,
  Post,
  Body,
  Delete,
  Req,
  Res,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GeneralAuthDto } from './dto/general-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/types/auth';
import { AuthConstants } from 'src/constants/auth';
import type { IReturnMessage } from 'src/types/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  @Post('signup')
  async signup(
    @Body() dto: GeneralAuthDto,
    @Res({passthrough: true}) res: Response,
  ): Promise<IReturnMessage> {
    const response = await this.authService.signup(dto);
    res.cookie('access_token', response.access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',

      maxAge: AuthConstants.MAX_ACCESS_COOKIE_AGE,
    });
    res.cookie('refresh_token', response.refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',

      maxAge: AuthConstants.MAX_REFRESH_COOKIE_AGE,
    });
    return { message: 'Successfully signed up!' };
  }

  @Post('login')
  async login(
    @Body() dto: GeneralAuthDto,
    @Res({passthrough: true}) res: Response,
  ): Promise<IReturnMessage> {
    const response = await this.authService.login(dto);
    res.cookie('access_token', response.access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',

      maxAge: AuthConstants.MAX_ACCESS_COOKIE_AGE,
    });
    res.cookie('refresh_token', response.refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',

      maxAge: AuthConstants.MAX_REFRESH_COOKIE_AGE,
    });
    return { message: 'Successfully logged in!' };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response,
  ): Promise<IReturnMessage> {
    const refreshToken = (req.cookies as Record<string, string | undefined>)[
      'refresh_token'
    ];
    if (!refreshToken) {
      throw new HttpException('No refresh token', HttpStatus.UNAUTHORIZED);
    }
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
      });
    } catch {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }


    const newAccessToken = await this.authService.createTokenForRefresh(payload.userId);
    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',
      maxAge: AuthConstants.MAX_ACCESS_COOKIE_AGE,
    });

    return { message: 'Access token refreshed' };
  }

  @Delete('logout')
  logout(@Res({ passthrough: true }) res: Response): IReturnMessage {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',
    });

    return { message: 'Successfully logged out!' };
  }
}
