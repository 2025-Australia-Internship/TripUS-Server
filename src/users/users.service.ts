import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import _ from 'lodash';
import { compare, hash } from 'bcrypt';
import { UpdateInfoDto } from './dto/update-info.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly JwtService: JwtService,
  ) {}

  // 회원가입
  async register(
    username: string,
    email: string,
    password: string,
    profile_image: string,
  ) {
    try {
      // 닉네임 (유저네임)
      if (!username) {
        throw new BadRequestException(
          'Please write your nickname. 닉네임을 입력해주세요.',
        );
      }

      // if (!usernameRegex.test(username)) {
      //   throw new BadRequestException(
      //     'Invalid nickname format. 올바르지 않은 닉네임 형식입니다.',
      //   );
      // }
      const existingUsername = await this.findByUsername(username);
      if (existingUsername) {
        throw new ConflictException(
          'Nickname already exists. 이미 존재하는 닉네임입니다.',
        );
      }

      if (!email) {
        throw new BadRequestException(
          'Please write your email. 이메일을 입력해주세요.',
        );
      }

      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new ConflictException(
          'Email already exists. 이미 존재하는 이메일입니다.',
        );
      }

      // 비밀번호
      const pwRegex =
        /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/;

      if (!pwRegex.test(password)) {
        throw new BadRequestException(
          'Invalid password format. 올바르지 않은 비밀번호 형식입니다.',
        );
      }

      if (!password) {
        throw new BadRequestException(
          'Please write your password. 비밀번호를 입력해주세요.',
        );
      }

      if (password.length < 8) {
        throw new BadRequestException(
          'Password must be at least 8 characters long. 비밀번호는 최소 8자 이상이어야 합니다.',
        );
      }

      // 비밀번호 해싱 및 저장
      const hashedPassword = await hash(password, 10);
      await this.usersRepository.save({
        username,
        email,
        password: hashedPassword,
        profile_image,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Internal Server Error. 서버 내부 오류입니다.',
      );
    }
  }

  // 로그인
  async login(email: string, password: string) {
    try {
      if (!email) {
        throw new BadRequestException(
          'Please write your email. 이메일을 입력해주세요.',
        );
      }

      const user = await this.usersRepository.findOne({
        select: ['id', 'email', 'password'],
        where: { email },
      });

      if (_.isNil(user)) {
        throw new UnauthorizedException(
          'There are no auth matching your email or password. 이메일 또는 비밀번호가 일치하는 인증 정보가 없습니다.',
        );
      }

      if (!password) {
        throw new BadRequestException(
          'Please write your password. 비밀번호를 입력해주세요.',
        );
      }

      if (!(await compare(password, user.password))) {
        throw new UnauthorizedException(
          'There are no info matching your email or password., 이메일 또는 비밀번호가 일치하는 정보가 없습니다.',
        );
      }

      // JWT 토큰 발급
      const payload = { email, sub: user.id };
      return {
        access_token: this.JwtService.sign(payload),
      };
    } catch (error) {
      throw new InternalServerErrorException('예상치 못한 에러 발생!');
    }
  }

  // username로 사용자 조회
  async findByUsername(username: string) {
    return await this.usersRepository.findOneBy({ username });
  }

  // email로 사용자 조회
  async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  // 닉네임 중복 확인
  async checkUsername(newUsername: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { username: newUsername },
    });

    return !user; // 사용 가능하면 true, 불가하면 false
  }

  async update(
    user: User,
    updateInfoDto: UpdateInfoDto,
  ): Promise<UpdateInfoDto> {
    try {
      // 닉네임 중복 확인
      if (updateInfoDto.username) {
        const isAvailabe = await this.checkUsername(updateInfoDto.username);
        if (!isAvailabe) {
          throw new Error('이 닉네임은 이미 존재합니다.');
        }
      }

      await this.usersRepository.update(user.id, updateInfoDto);
      const updateInfo = await this.usersRepository.findOne({
        where: { id: user.id },
      });
      return updateInfo;
    } catch (error) {
      console.log('Update user info error : ', error);
      throw error;
    }
  }
}
