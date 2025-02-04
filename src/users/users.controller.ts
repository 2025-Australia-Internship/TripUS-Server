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
    return await this.usersService.register(registerDto);
  }

  @Post('login')
  async regiloginster(@Body() loginDto: LoginDto) {
    return await this.usersService.login(loginDto);
  }

  @Post('check-availability')
  async checkAvailability(
    @Body() body: { field: 'username' | 'email'; value: string },
  ): Promise<{ isAvailable: boolean }> {
    const { field, value } = body;
    const isAvailable = await this.usersService.checkAvailability(field, value);
    return { isAvailable };
  }
}

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UsersInfoController {
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
