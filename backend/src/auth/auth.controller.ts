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
import { JwtPayload } from 'src/types/auth';
import type { IReturnMessage } from 'src/types/common';
import { AUTH_CONSTANTS } from 'src/constants/auth';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
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

    const user = await this.authService.findOrCreateGoogleUser(profile);

    const access_token = await this.authService.createTokenForAccess(user.id);
    const refresh_token = await this.authService.createTokenForRefresh(user.id);

    this.setCookies(res, access_token, refresh_token);

    const frontendUrl = this.configService.get<string>('FRONT_END_URL') || 'http://localhost:3000';

    // Повертаємо HTML з скриптом для навігації на фронтенд. 
    // Це дозволяє фронтенду "підхопити" стан і уникнути проблем з жорстким редіректом.
    return res.send(`
      <html>
        <body>
          <script>
            window.location.href = "${frontendUrl}/auth/login";
          </script>
        </body>
      </html>
    `);
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