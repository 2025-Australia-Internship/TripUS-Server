import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { AuthGuard } from '@nestjs/passport'; // Passport에서 제공하는 AuthGuard를 가져옴
import { UserInfo } from './utils/userInfo.decorator';
import { UpdateInfoDto } from './dto/update-info.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(readonly usersService: UsersService) {}

  @Get('info')
  async findOne(@UserInfo('id') userId: number) {
    return this.usersService.findOne(userId);
  }

  @Patch('info')
  async updateInfo(
    @UserInfo('id') userId: number,
    @Body() updateInfoDto: UpdateInfoDto,
  ) {
    return this.usersService.update(userId, updateInfoDto);
  }

  // // 콜렉션 불러오기
  // @Get('collection')
  // async getCollection(@UserInfo() user: User) {
  //   try {
  //     const collection = await this.usersService.getCollection(user);
  //     return { collection };
  //   } catch (error) {
  //     console.error('Error collection : ', error);
  //     throw error;
  //   }
  // }

  // @Patch('background')
  // async changeBackground(
  //   @UserInfo() user: User,
  //   @Body('landmark_id') landmark_id: number,
  // ) {
  //   try {
  //     return await this.usersService.changeBackground(user, landmark_id);
  //   } catch (error) {
  //     console.error('Error can not change background : ', error);
  //     throw error;
  //   }
  // }
}
