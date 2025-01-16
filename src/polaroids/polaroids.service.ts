import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Polaroid } from './entities/polaroid.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PolaroidDto } from './dto/polaroid.dto';
import { User } from 'src/users/entities/user.entity';
import { Landmark } from '../landmarks/entities/landmark.entity';

@Injectable()
export class PolaroidsService {
  constructor(
    @InjectRepository(Polaroid)
    private polaroidRepository: Repository<Polaroid>,
  ) {}

  async create(user: User, polaroidDto: PolaroidDto): Promise<Polaroid> {
    const polaroid = this.polaroidRepository.create({
      ...polaroidDto,
      user: user,
    });
    return this.polaroidRepository.save(polaroid);
  }

  async findAll(user: User): Promise<Polaroid[]> {
    try {
      const polaroid = await this.polaroidRepository.find({
        where: { user: { id: user.id } },
        relations: ['user'],
      });

      if (polaroid.length == 0) {
        throw new NotFoundException(`폴라로이드가 없습니다`);
      }

      return polaroid;
    } catch (error) {
      console.error('Error finding Polaroid:', error);
      throw error;
    }
  }

  async findOne(user: User, id: number): Promise<Polaroid> {
    try {
      const polaroid = await this.polaroidRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      // 폴라로이드가 존재하지 않을 경우
      if (!polaroid) {
        throw new NotFoundException('폴라로이드가 없습니다.');
      }

      // 해당 유저가 소유하지 않은 경우
      if (!polaroid.user || polaroid.user.id !== user.id) {
        throw new ForbiddenException('이 폴라로이드에 접근할 수 없습니다.');
      }
      return polaroid;
    } catch (error) {
      console.error('Error finding Polaroid:', error);
      throw error;
    }
  }

  async update(
    user: User,
    id: number,
    polaroidDto: PolaroidDto,
  ): Promise<PolaroidDto> {
    try {
      const polaroid = await this.polaroidRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!polaroid) {
        throw new NotFoundException(
          '해당 id의 폴라로이드 내용은 존재하지 않습니다.',
        );
      }

      if (!polaroid.user || polaroid.user.id !== user.id) {
        throw new ForbiddenException('이 폴라로이드에 접근할 수 없습니다.');
      }
      await this.polaroidRepository.update(id, polaroidDto);
      const updatePolaroid = await this.polaroidRepository.findOne({
        where: {
          id,
        },
      });
      return updatePolaroid;
    } catch (error) {
      console.error('Polaroid Error : ', error);
      throw error;
    }
  }
}
