import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/users/utils/userInfo.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':landmark_id')
  async create(
    @UserInfo() user: User,
    @Param('landmark_id') landmark_id: number,
  ) {
    return this.visitsService.create(user, landmark_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@UserInfo() user: User) {
    return this.visitsService.findAll(user);
  }
}
