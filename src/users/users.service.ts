import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { UpdateInfoDto } from './dto/update-info.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findUserByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const userInfo = {
        username: user.username,
        email: user.email,
        profile_image: user.profile_image,
        status: user.status,
      };

      return {
        status: HttpStatus.OK,
        message: 'User retrieved successfully.',
        data: userInfo,
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async update(id: number, updateInfoDto: UpdateInfoDto) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const username = await this.findUserByUsername(updateInfoDto.username);
      if (username) {
        throw new BadRequestException('Username is already in use.');
      }

      await this.userRepository.update(id, updateInfoDto);

      const updatedUser = await this.userRepository.findOneBy({
        id,
      });

      return {
        status: HttpStatus.OK,
        message: 'User updated successfully.',
        data: updatedUser,
      };
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to user update.');
    }
  }

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
