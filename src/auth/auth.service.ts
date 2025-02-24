import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UsersService,
    private readonly JwtService: JwtService,
  ) {}

  // 회원가입
  async register(registerDto: RegisterDto) {
    try {
      const existingUserByEmail = await this.userService.findUserByEmail(
        registerDto.email,
      );
      if (existingUserByEmail) {
        throw new BadRequestException('Email is already in use.');
      }

      const existingUserByUsername = await this.userService.findUserByUsername(
        registerDto.username,
      );

      if (existingUserByUsername) {
        throw new BadRequestException('Username is already in use.');
      }

      const hashedPassword = await hash(registerDto.password, 10);

      const newUser = {
        ...registerDto,
        password: hashedPassword,
      };
      await this.userRepository.save(newUser);
      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        data: newUser,
      };
    } catch (e) {
      if (e instanceof BadRequestException) {
      }
      throw new InternalServerErrorException('Failed to create user');
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
        throw new NotFoundException('User not found.');
      }

      const isPasswordVaild = await compare(loginDto.password, user.password);
      if (!isPasswordVaild) {
        throw new UnauthorizedException('Password is incorrect.');
      }

      // JWT 토큰 발급
      const payload = { email: user.email, sub: user.id };
      const access_token = this.JwtService.sign(payload);

      return {
        status: HttpStatus.OK,
        message: 'Login successfully',
        data: user,
        access_token: access_token,
      };
    } catch (e) {
      if (
        e instanceof NotFoundException ||
        e instanceof UnauthorizedException
      ) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to login.');
    }
  }
}
