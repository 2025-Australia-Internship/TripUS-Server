import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookmarkService } from './bookmarks.service';
import { UserInfo } from 'src/users/utils/userInfo.decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('api/bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post(':landmark_id')
  async create(
    @UserInfo() user: User,
    @Param('landmark_id') landmark_id: number,
  ) {
    return this.bookmarkService.create(user, landmark_id);
  }
}
