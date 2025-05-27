import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookmarkService } from './bookmarks.service';
import { UserInfo } from 'src/users/utils/userInfo.decorator';
import { User } from 'src/users/entities/user.entity';
import { BookmarkDto } from './dto/bookmark.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  async find(@UserInfo('id') id: number) {
    return this.bookmarkService.find(id);
  }

  @Post()
  async create(@UserInfo() user: User, @Body() bookmarkDto: BookmarkDto) {
    return this.bookmarkService.create(user, bookmarkDto);
  }
}
