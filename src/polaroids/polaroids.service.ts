import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Polaroid } from './entities/polaroid.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreatePolaroidDto } from './dto/create-polaroid.dto';
import { LandmarksService } from 'src/landmarks/landmarks.service';

@Injectable()
export class PolaroidsService {
  constructor(
    @InjectRepository(Polaroid)
    private polaroidRepository: Repository<Polaroid>,
    private LandmarkService: LandmarksService,
  ) {}

  async create(
    user: User,
    createPolaroidDto: CreatePolaroidDto,
  ): Promise<Polaroid> {
    try {
      const landmark = await this.LandmarkService.findOne(
        createPolaroidDto.landmark_id,
      );

      const polaroid = {
        ...createPolaroidDto,
        user,
        user_id: user.id,
        landmark,
      };

      return await this.polaroidRepository.save(polaroid);
    } catch (e) {
      throw new InternalServerErrorException('Failed to create polaroid');
    }
  }

  async findAll(user_id: number): Promise<Polaroid[] | null> {
    try {
      return await this.polaroidRepository.find({
        where: { user_id },
      });
    } catch (e) {
      throw new InternalServerErrorException('Failed to retrieve polaroids');
    }
  }

  async findOne(
    user_id: number,
    polaroid_id: number,
  ): Promise<Polaroid | null> {
    try {
      return await this.polaroidRepository.findOne({
        where: { id: polaroid_id, user_id },
      });
    } catch (e) {
      throw new InternalServerErrorException('Failed to retrieve polaroid');
    }
  }

  // async update(
  //   user_id: number,
  //   polaroid_id: number,
  //   polaroidDto: PolaroidDto,
  // ): Promise<Polaroid> {
  //   try {
  //     const polaroid = await this.polaroidRepository.findOne({
  //       where: { id: polaroid_id, user_id },
  //     });

  //     if (!polaroid) {
  //       throw new NotFoundException('Polaroid not found');
  //     }

  //     await this.polaroidRepository.update(polaroid_id, polaroidDto);
  //     return await this.polaroidRepository.findOne({
  //       where: {
  //         id: polaroid_id,
  //         user_id,
  //       },
  //     });
  //   } catch (e) {
  //     if (e instanceof NotFoundException) {
  //       throw e;
  //     }
  //     throw new InternalServerErrorException('Failed to update polaroid');
  //   }
  // }

  async delete(user_id: number, polaroid_id: number) {
    try {
      const polaroid = await this.polaroidRepository.findOne({
        where: { id: polaroid_id, user_id },
        relations: ['user'],
      });

      if (!polaroid) {
        throw new NotFoundException('Polaroid not found');
      }

      return await this.polaroidRepository.remove(polaroid);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to delete polaroid');
    }
  }
}
