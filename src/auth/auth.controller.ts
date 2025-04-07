import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
