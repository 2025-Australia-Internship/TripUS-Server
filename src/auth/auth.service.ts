import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { ResponseStrategy } from 'src/shared/response.strategy';
import { LoginDto } from 'src/users/dto/login.dto';
import { RegisterDto } from 'src/users/dto/register.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private responseStrategy: ResponseStrategy,
    private readonly JwtService: JwtService,
  ) {}
  // 회원가입
  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await hash(registerDto.password, 10);

      const newUser = {
        ...registerDto,
        password: hashedPassword,
      };
      await this.userRepository.save(newUser);
      return this.responseStrategy.success(
        'User created successfully',
        newUser,
      );
    } catch (error) {
      return this.responseStrategy.error('Failed to create user', error);
    }
  }

  // 로그인
  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        select: ['id', 'email', 'password'],
        where: { email: loginDto.email },
      });

      if (!user) {
        return this.responseStrategy.notFound('User not found');
      }

      const isPasswordVaild = await compare(loginDto.password, user.password);
      if (!isPasswordVaild) {
        return this.responseStrategy.error('Invaild credentials', null);
      }

      // JWT 토큰 발급
      const payload = { email: user.email, sub: user.id };
      const access_token = this.JwtService.sign(payload);

      return this.responseStrategy.success('Login successfully', access_token);
    } catch (error) {
      return this.responseStrategy.error('Failed to login', error);
    }
  }

  // 이메일 또는 닉네임 중복 확인
  async checkAvailability(
    field: 'username' | 'email',
    value: string,
  ): Promise<boolean> {
    try {
      if (field === 'username') {
        return await this.checkUsername(value);
      } else if (field === 'email') {
        return await this.checkEmail(value);
      } else {
        return this.responseStrategy.error(`Already existing ${field}`);
      }
    } catch (error) {
      return this.responseStrategy.error('Failed to check availability');
    }
  }

  private async checkUsername(username: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ username });
    return !user;
  }

  private async checkEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    return !user;
  }
}
