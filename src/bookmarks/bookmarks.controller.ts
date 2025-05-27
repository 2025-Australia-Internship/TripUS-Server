import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookmarkService } from './bookmarks.service';
import { UserInfo } from 'src/users/utils/userInfo.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  async find(@UserInfo('id') id: number) {
    return await this.bookmarkService.find(id);
  }

  @Post()
  async create(
    @UserInfo() user: User,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.create(user, createBookmarkDto);
  }

  @Patch(':landmark_id')
  async update(
    @UserInfo('id') id: number,
    @Param('landmark_id') landmark_id: number,
  ) {
    return this.bookmarkService.update(id, landmark_id);
  }

  @Get(':landmark_id/status')
  async findOne(
    @UserInfo('id') id: number,
    @Param('landmark_id') landmark_id: number,
  ) {
    return this.bookmarkService.findOne(id, landmark_id);
  }
}
