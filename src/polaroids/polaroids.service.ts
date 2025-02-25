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
        where: { user: { id } },
      });

      if (!polaroid) {
        throw new NotFoundException('Polaroids not found');
      }

      return {
        status: HttpStatus.OK,
        message: 'Polaroids retrieved successfully',
        data: polaroid,
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to retrieve polaroids');
    }
  }

  async findOne(id: number, polaroid_id: number) {
    try {
      const polaroid = await this.polaroidRepository.findOne({
        where: { id: polaroid_id, user: { id } },
      });

      if (!polaroid) {
        throw new NotFoundException('Polaroid not found');
      }

      return {
        status: HttpStatus.OK,
        message: 'Polaroid retrieved successfully',
        data: polaroid,
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to retrieve polaroid');
    }
  }

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
