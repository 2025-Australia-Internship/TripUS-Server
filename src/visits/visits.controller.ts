import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/users/utils/userInfo.decorator';
import { User } from 'src/users/entities/user.entity';
import { Landmark } from 'src/landmarks/entities/landmark.entity';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  // 랜드마크 아이디 받아서 넣기..
  @UseGuards(AuthGuard('jwt'))
  @Post(':landmark_id')
  async create(
    @UserInfo() user: User,
    @Param('landmark_id') landmark_id: Landmark,
  ) {
    return this.visitsService.create(user, landmark_id);
  }
}
