import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
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
import { Visit } from 'src/visits/entities/visit.entity';
import { Landmark } from 'src/landmarks/entities/landmark.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly JwtService: JwtService,

    @InjectRepository(Visit)
    private visitRepository: Repository<Visit>,

    @InjectRepository(Landmark)
    private landmarkRepository: Repository<Landmark>,
  ) {}

  // 회원가입
  async register(
    username: string,
    email: string,
    password: string,
    profile_image: string,
  ) {
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
    const pwRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/;

    if (!password) {
      throw new BadRequestException(
        'Please write your password. 비밀번호를 입력해주세요.',
      );
    }

    if (!pwRegex.test(password)) {
      throw new BadRequestException(
        'Invalid password format. 올바르지 않은 비밀번호 형식입니다.',
      );
    }

    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long. 비밀번호는 최소 8자 이상이어야 합니다.',
      );
    }

    try {
      // 비밀번호 해싱 및 저장
      const hashedPassword = await hash(password, 10);
      await this.usersRepository.save({
        username,
        email,
        password: hashedPassword,
        profile_image,
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  // 로그인
  async login(email: string, password: string) {
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

    try {
      // JWT 토큰 발급
      const payload = { email, sub: user.id };
      return {
        access_token: this.JwtService.sign(payload),
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new InternalServerErrorException('Failed to login');
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

  // 이메일 또는 닉네임 중복 확인
  private async checkAvailability(
    field: string,
    value: string,
  ): Promise<boolean> {
    try {
      const user = await this.usersRepository.findOne({
        where: { [field]: value },
      });
      return !user; // 사용 가능하면 true, 불가하면 false
    } catch (error) {
      throw new Error(
        `Failed to check ${field} availability: ${error.message}`,
      );
    }
  }

  async checkUsername(newUsername: string): Promise<boolean> {
    return this.checkAvailability('username', newUsername.toLowerCase());
  }

  async checkEmail(newUserEmail: string): Promise<boolean> {
    return this.checkAvailability('email', newUserEmail.toLowerCase());
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
          throw new Error('Username is already exsit');
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

  // 컬렉션(배경화면) 상태 확인
  async getCollection(user: User) {
    try {
      const landmarks = await this.landmarkRepository.find();
      const visits = await this.visitRepository.find({
        where: { user: { id: user.id } },
        relations: ['landmark'],
      });

      const visitSet = new Set(visits.map((visit) => visit.landmark.id));

      return landmarks.map((landmark) => ({
        ...landmark,
        locked: !visitSet.has(landmark.id),
      }));
    } catch (error) {
      console.error('Error collection: ', error);
    }
  }

  // 배경 바꾸기
  async changeBackground(user: User, landmark_id: number) {
    try {
      const visited = this.visitRepository.findOne({
        where: { user: { id: user.id }, landmark: { id: landmark_id } },
        relations: ['landmark'],
      });

      if (!visited) {
        throw new HttpException(
          '해당 배경화면을 선택할 수 없습니다.',
          HttpStatus.FORBIDDEN,
        );
      }

      const landmark = (await visited).landmark;
      if (!landmark) {
        throw new HttpException(
          '방문한 랜드마크의 배경이 아닙니다.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.usersRepository.update(user.id, {
        background_url: landmark.background_image,
      });

      return { message: '배경화면이 변경되었습니다.' };
    } catch (error) {
      throw new HttpException(
        error.message || '배경화면 변경 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
