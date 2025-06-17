import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/users/utils/userInfo.decorator';
import { UsersService } from 'src/users/users.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    return await this.userService.checkUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('register')
  async completeRegister(
    @UserInfo('id') id: number,
    @Body() registerDto: RegisterDto,
  ) {
    return await this.authService.completeRegister(id, registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
