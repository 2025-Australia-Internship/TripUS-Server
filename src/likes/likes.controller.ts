import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @Get(':landmark_id/status')
  async findOne(
    @UserInfo('id') id: number,
    @Param('landmark_id') landmark_id: number,
  ) {
    return this.likesService.findOne(id, landmark_id);
  }

  @Patch(':landmark_id')
  async update(
    @UserInfo('id') id: number,
    @Param('landmark_id') landmark_id: number,
  ) {
    return this.likesService.update(id, landmark_id);
  }
}
