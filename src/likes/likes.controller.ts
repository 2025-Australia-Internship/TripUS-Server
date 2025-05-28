import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LikesService } from './likes.service';
import { UserInfo } from 'src/users/utils/userInfo.decorator';
import { CreateLikesDto } from './dto/create-like.dto';
import { User } from 'src/users/entities/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('api/likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post()
  async create(@UserInfo() user: User, @Body() createLikesDto: CreateLikesDto) {
    return this.likesService.create(user, createLikesDto);
  }

  @Get()
  async find(@UserInfo('id') id: number) {
    return this.likesService.find(id);
  }
}
