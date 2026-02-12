import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from '@nestjs/passport';
import type { AuthRequest } from 'src/types/auth';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { IReturnMessage } from 'src/types/common';
import { ReturnOwnProfile } from 'src/types/profiles';

@Controller('profiles')
@UseGuards(AuthGuard('jwt'))
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  async profile(@Req() request: AuthRequest): Promise<ReturnOwnProfile | null> {
    return this.profilesService.getOwnProfile(request.user.id);
  }

  @Patch('update')
  async update(
    @Req() request: AuthRequest,
    @Body() dto: UpdateProfileDto,
  ): Promise<IReturnMessage> {
    return this.profilesService.updateProfile(request.user.id, dto);
  }
}
