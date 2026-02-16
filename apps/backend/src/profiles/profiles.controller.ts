import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from '@nestjs/passport';
import type { AuthRequest } from 'src/types/auth';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { IReturnMessage } from 'src/types/common';
import { GetProfileResponseDto } from './dto/get-profile-response.dto';

@Controller('profiles')
@UseGuards(AuthGuard('jwt'))
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  async profile(@Req() request: AuthRequest): Promise<GetProfileResponseDto | null> {
    const profile = await this.profilesService.getOwnProfile(request.user.id);
    return profile as GetProfileResponseDto | null;
  }

  @Patch('update')
  async update(
    @Req() request: AuthRequest,
    @Body() dto: UpdateProfileDto,
  ): Promise<IReturnMessage> {
    return this.profilesService.updateProfile(request.user.id, dto);
  }
}
