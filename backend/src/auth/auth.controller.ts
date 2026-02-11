import {
  Controller,
  Post,
  Body,
  Delete,
  Req,
  Res,
  HttpException,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GeneralAuthDto } from './dto/general-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import type { IReturnMessage } from 'src/types/common';
import { AUTH_CONSTANTS } from 'src/constants/auth';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }



  @Post('google')
  async googleAuth(
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IReturnMessage> {
    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    const payload = await this.authService.verifyGoogleToken(token);
    const user = await this.authService.findOrCreateGoogleUser(payload);

    const access_token = await this.authService.createTokenForAccess(user.id);
    const refresh_token = await this.authService.createTokenForRefresh(user.id);

    this.setCookies(res, access_token, refresh_token);

    return { message: 'Successfully logged in with Google!' };
  }





  @Post('signup')
  async signup(
    @Body() dto: GeneralAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IReturnMessage> {
    const response = await this.authService.signup(dto);
    this.setCookies(res, response.access_token, response.refresh_token);
    return { message: 'Successfully signed up!' };
  }

  @Post('login')
  async login(
    @Body() dto: GeneralAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IReturnMessage> {
    const response = await this.authService.login(dto);
    this.setCookies(res, response.access_token, response.refresh_token);
    return { message: 'Successfully logged in!' };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IReturnMessage> {
    const refreshToken = (req.cookies as Record<string, string | undefined>)[
      'refresh_token'
    ];
    if (!refreshToken) {
      throw new HttpException('No refresh token', HttpStatus.UNAUTHORIZED);
    }
    const decode = await this.authService.getJwtPayloadFromRefreshToken(refreshToken);
    const newAccessToken = await this.authService.createTokenForAccess(decode.userId);
    this.setAccessCookie(res, newAccessToken);
    return { message: 'Access token refreshed' };
  }

  @Delete('logout')
  logout(@Res({ passthrough: true }) res: Response): IReturnMessage {
    this.clearCookies(res);
    return { message: 'Successfully logged out!' };
  }


  // private methods for cookies 

  private setCookies(res: Response, access_token: string, refresh_token: string): void {
    this.setAccessCookie(res, access_token);
    this.setRefreshCookie(res, refresh_token);
  }

  private setAccessCookie(res: Response, access_token: string): void {
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',

      maxAge: AUTH_CONSTANTS.MAX_ACCESS_COOKIE_AGE,
    });
  }

  private setRefreshCookie(res: Response, refresh_token: string): void {
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',

      maxAge: AUTH_CONSTANTS.MAX_REFRESH_COOKIE_AGE,
    });
  }

  private clearCookies(res: Response): void {
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
  }
  //

}