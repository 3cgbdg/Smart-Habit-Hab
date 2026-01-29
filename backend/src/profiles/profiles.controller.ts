import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }


  @Get("me")
  @UseGuards(AuthGuard('jwt'))
  async profile(@Req() request: Request): Promise<any | null> {
    return this.profilesService.getOwnProfile((request as any).userId)
  }
}
