import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  HttpCode,
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

  @Get('check-email') 
  async checkEmail(@Query('email') email: string) {
    console.log('이메일 중복 확인 요청 들어옴:', email);
    const user = await this.userService.findUserByEmail(email);
    return { isDuplicate: !!user }; // true면 중복
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    const isDuplicate = await this.userService.checkUsername(username);
    return { isDuplicate };
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
