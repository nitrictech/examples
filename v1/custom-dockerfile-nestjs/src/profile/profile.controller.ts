import { Controller, Get, Post, Delete, Param, Req } from '@nestjs/common';
import { Profile, ProfileService } from './profile.service';
import { Request } from 'express';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/profile/:id')
  async getProfile(@Param('id') id: string) {
    return await this.profileService.getProfile(id);
  }

  @Post('/profile')
  async createProfile(@Req() req: Request<Omit<Profile, 'id'>>) {
    return await this.profileService.createProfile(req.body);
  }

  @Delete('/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    return await this.profileService.deleteProfile(id);
  }
}
