import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from '@nestjs/passport';
import type { AuthRequest } from 'src/types/auth';
import type { ReturnOwnProfile } from 'src/types/profiles';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async profile(@Req() request: AuthRequest): Promise<ReturnOwnProfile | null> {
    return this.profilesService.getOwnProfile(request.user.id);
  }
}
