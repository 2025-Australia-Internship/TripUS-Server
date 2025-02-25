import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Polaroid } from './entities/polaroid.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePolaroidDto } from './dto/create-polaroid.dto';
import { User } from 'src/users/entities/user.entity';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class PolaroidsService {
  constructor(
    @InjectRepository(Polaroid)
    private polaroidRepository: Repository<Polaroid>,
  ) {}

  async create(id: number, createPolaroidDto: CreatePolaroidDto) {
    try {
      const polaroid = {
        ...createPolaroidDto,
        user: { id },
      };

      await this.polaroidRepository.save(polaroid);

      return {
        status: HttpStatus.CREATED,
        message: 'Polaroid created successfully',
        data: polaroid,
      };
    } catch (e) {
      throw new InternalServerErrorException('Failed to create polaroid');
    }
  }

  async findAll(id: number) {
    try {
      const polaroid = await this.polaroidRepository.find({
        where: { user: { id: id } },
      });

      return polaroid;
    } catch (error) {
      console.error('Error finding Polaroid:', error);
      throw error;
    }
  }

  // async findOne(id: number): Promise<Polaroid> {
  //   try {
  //     const polaroid = await this.polaroidRepository.findOne({
  //       where: { id },
  //       relations: ['user'],
  //     });

  //     // 폴라로이드가 존재하지 않을 경우
  //     if (!polaroid) {
  //       throw new NotFoundException('폴라로이드가 없습니다.');
  //     }

  //     // 해당 유저가 소유하지 않은 경우
  //     if (!polaroid.user || polaroid.user.id !== user.id) {
  //       throw new ForbiddenException('이 폴라로이드에 접근할 수 없습니다.');
  //     }
  //     return polaroid;
  //   } catch (error) {
  //     console.error('Error finding Polaroid:', error);
  //     throw error;
  //   }
  // }

  // async update(
  //   user: User,
  //   id: number,
  //   polaroidDto: PolaroidDto,
  // ): Promise<PolaroidDto> {
  //   try {
  //     const polaroid = await this.polaroidRepository.findOne({
  //       where: { id },
  //       relations: ['user'],
  //     });

  //     if (!polaroid) {
  //       throw new NotFoundException(
  //         '해당 id의 폴라로이드 내용은 존재하지 않습니다.',
  //       );
  //     }

  //     if (!polaroid.user || polaroid.user.id !== user.id) {
  //       throw new ForbiddenException('이 폴라로이드에 접근할 수 없습니다.');
  //     }
  //     await this.polaroidRepository.update(id, polaroidDto);
  //     const updatePolaroid = await this.polaroidRepository.findOne({
  //       where: {
  //         id,
  //       },
  //     });
  //     return updatePolaroid;
  //   } catch (error) {
  //     console.error('Polaroid Error : ', error);
  //     throw error;
  //   }
  // }

  // async delete(user: User, id: number) {
  //   try {
  //     const polaroid = await this.polaroidRepository.findOne({
  //       where: { id },
  //       relations: ['user'],
  //     });

  //     if (!polaroid) {
  //       throw new NotFoundException(
  //         '해당 id의 폴라로이드 내용은 존재하지 않습니다.',
  //       );
  //     }

  //     if (!polaroid.user || polaroid.user.id !== user.id) {
  //       throw new ForbiddenException('이 폴라로이드에 접근할 수 없습니다.');
  //     }

  //     return this.polaroidRepository.delete(id);
  //   } catch (error) {
  //     console.error('Polaroid Error : ', error);
  //     throw error;
  //   }
  // }
}
