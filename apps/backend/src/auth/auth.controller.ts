import {
  Controller,
  Post,
  Body,
  Delete,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { GeneralAuthDto } from './dto/general-auth.dto';
import type { IReturnMessage } from 'src/types/common';
import { CookiesService } from './cookies.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookiesService: CookiesService,
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

    this.cookiesService.setCookies(res, access_token, refresh_token);

    return { message: 'Successfully logged in with Google!' };
  }

  @Post('signup')
  async signup(
    @Body() dto: GeneralAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IReturnMessage> {
    const response = await this.authService.signup(dto);
    this.cookiesService.setCookies(res, response.access_token, response.refresh_token);
    return { message: 'Successfully signed up!' };
  }

  @Post('login')
  async login(
    @Body() dto: GeneralAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IReturnMessage> {
    const response = await this.authService.login(dto);
    this.cookiesService.setCookies(res, response.access_token, response.refresh_token);
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
    this.cookiesService.setAccessCookie(res, newAccessToken);
    return { message: 'Access token refreshed' };
  }

  @Delete('logout')
  logout(@Res({ passthrough: true }) res: Response): IReturnMessage {
    this.cookiesService.clearCookies(res);
    return { message: 'Successfully logged out!' };
  }
}