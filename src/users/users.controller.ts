import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
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
}
