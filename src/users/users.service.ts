import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import _ from 'lodash';
import { compare, hash } from 'bcrypt';
import { UpdateInfoDto } from './dto/update-info.dto';
import { Visit } from 'src/visits/entities/visit.entity';
import { Landmark } from 'src/landmarks/entities/landmark.entity';
import { RegisterDto } from './dto/register.dto';
import { ResponseStrategy } from 'src/shared/response.strategy';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
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

  async findOne(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        return this.responseStrategy.notFound('User not found');
      }

      const userInfo = {
        username: user.username,
        email: user.email,
        profile_image: user.profile_image,
        status: user.status,
      };

      return this.responseStrategy.success('User retrieved successfully');
    } catch (error) {
      return this.responseStrategy.error('Failed to retrieve user', error);
    }
  }

  async update() {}

  // 컬렉션(배경화면) 상태 확인
  // async getCollection(user: User) {
  //   try {
  //     const landmarks = await this.landmarkRepository.find();
  //     const visits = await this.visitRepository.find({
  //       where: { user: { id: user.id } },
  //       relations: ['landmark'],
  //     });

  //     const visitSet = new Set(visits.map((visit) => visit.landmark.id));

  //     return landmarks.map((landmark) => ({
  //       ...landmark,
  //       locked: !visitSet.has(landmark.id),
  //     }));
  //   } catch (error) {
  //     console.error('Error collection: ', error);
  //   }
  // }

  // // 배경 바꾸기
  // async changeBackground(user: User, landmark_id: number) {
  //   try {
  //     const visited = this.visitRepository.findOne({
  //       where: { user: { id: user.id }, landmark: { id: landmark_id } },
  //       relations: ['landmark'],
  //     });

  //     if (!visited) {
  //       throw new HttpException(
  //         '해당 배경화면을 선택할 수 없습니다.',
  //         HttpStatus.FORBIDDEN,
  //       );
  //     }

  //     const landmark = (await visited).landmark;
  //     if (!landmark) {
  //       throw new HttpException(
  //         '방문한 랜드마크의 배경이 아닙니다.',
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }

  //     await this.usersRepository.update(user.id, {
  //       background_url: landmark.background_image,
  //     });

  //     return { message: '배경화면이 변경되었습니다.' };
  //   } catch (error) {
  //     throw new HttpException(
  //       error.message || '배경화면 변경 중 오류가 발생했습니다.',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
