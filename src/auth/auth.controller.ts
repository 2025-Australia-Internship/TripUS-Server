import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/users/dto/login.dto';
import { RegisterDto } from 'src/users/dto/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async regiloginster(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('check-availability')
  async checkAvailability(
    @Body() body: { field: 'username' | 'email'; value: string },
  ): Promise<{ isAvailable: boolean }> {
    const { field, value } = body;
    const isAvailable = await this.authService.checkAvailability(field, value);
    return { isAvailable };
  }
}
