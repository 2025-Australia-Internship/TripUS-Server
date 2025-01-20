import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport'; // Passport에서 제공하는 AuthGuard를 가져옴
import { UserInfo } from './utils/userInfo.decorator';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { UpdateInfoDto } from './dto/update-info.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.usersService.register(
      registerDto.username,
      registerDto.email,
      registerDto.password,
      registerDto.profile_image,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.usersService.login(loginDto.email, loginDto.password);
  }
}

@Controller('user')
export class UsersInfoController {
  constructor(readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  async userInfo(@UserInfo() user: User) {
    return {
      profile_image: user.profile_image,
      email: user.email,
      username: user.username,
      status: user.status,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('info')
  async updateInfo(
    @UserInfo() user: User,
    @Body() updateInfoDto: UpdateInfoDto,
  ) {
    return this.usersService.update(user, updateInfoDto);
  }

  // 콜렉션 불러오기
  @UseGuards(AuthGuard('jwt'))
  @Get('collection')
  async getCollection(@UserInfo() user: User) {
    try {
      const collection = await this.usersService.getCollection(user);
      return { collection };
    } catch (error) {
      console.error('Error collection : ', error);
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('background')
  async changeBackground(
    @UserInfo() user: User,
    @Body('landmark_id') landmark_id: number,
  ) {
    try {
      return await this.usersService.changeBackground(user, landmark_id);
    } catch (error) {
      console.error('Error can not change background : ', error);
      throw error;
    }
  }
}
