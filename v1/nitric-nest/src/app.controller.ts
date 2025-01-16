import { Controller, Get, Post, Delete, Param, Req } from '@nestjs/common';
import { Profile, AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/profile/:id')
  async getProfile(@Param('id') id: string) {
    return await this.appService.getProfile(id);
  }

  @Post('/profile')
  async createProfile(@Req() req: Request<Omit<Profile, 'id'>>) {
    return await this.appService.createProfile(req.body);
  }

  @Delete('/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    return await this.appService.deleteProfile(id);
  }
}
