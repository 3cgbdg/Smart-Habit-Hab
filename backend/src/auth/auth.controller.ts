import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Req,
  Res,
  HttpException,
  HttpStatus,
  NotFoundException,
  UseGuards,
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
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // triggers google auth redirect
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const profile = req.user as any;
    if (!profile) {
      throw new HttpException('Google authentication failed', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.usersService.findOrCreateGoogleUser(profile);
    const response = await this.authService.loginWithUser(user);

    res.cookie('access_token', response.access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_token', response.refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',
      maxAge: 1000 * 3600 * 24 * 7,
    });

    // Redirect to frontend dashboard
    return res.redirect(this.configService.get<string>('FRONT_END_URL') || 'http://localhost:3000');
  }

  @Post('signup')
  async signup(
    @Body() dto: GeneralAuthDto,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const response = await this.authService.signup(dto);
    res.cookie('access_token', response.access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',

      maxAge: 1000 * 60 * 15,
    });
    res.cookie('refresh_token', response.refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',

      maxAge: 1000 * 3600 * 24 * 7,
    });
    return res.json({ message: 'Successfully signed up!' });
  }

  @Post('login')
  async login(
    @Body() dto: GeneralAuthDto,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const response = await this.authService.login(dto);
    res.cookie('access_token', response.access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',

      maxAge: 1000 * 60 * 15,
    });
    res.cookie('refresh_token', response.refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',

      maxAge: 1000 * 3600 * 24 * 7,
    });
    return res.json({ message: 'Successfully logged in!' });
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
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

    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new NotFoundException();
    }
    const newAccessToken = await this.authService.createTokenForRefresh(user);
    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',
      maxAge: 1000 * 60 * 15,
    });

    return res.json({ message: 'Access token refreshed' });
  }

  @Delete('logout')
  logout(@Res() res: Response): Response {
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

    return res.json({ message: 'Successfully logged out!' });
  }
}
