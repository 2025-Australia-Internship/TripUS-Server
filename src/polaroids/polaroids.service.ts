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
import { UpdatePolaroidDto } from './dto/update-polaroid.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PolaroidsService {
  constructor(
    @InjectRepository(Polaroid)
    private polaroidRepository: Repository<Polaroid>,
    private LandmarkService: LandmarksService,
    private userService: UsersService,
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

  async findAll(user_id: number): Promise<Polaroid[]> {
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

  async update(
    user_id: number,
    polaroid_id: number,
    updatePolaroidDto: UpdatePolaroidDto,
  ): Promise<Polaroid> {
    try {
      const polaroid = await this.polaroidRepository.findOne({
        where: { id: polaroid_id, user_id },
      });

      if (!polaroid) {
        throw new NotFoundException('Polaroid not found');
      }

      await this.polaroidRepository.update(polaroid_id, updatePolaroidDto);
      return await this.polaroidRepository.findOne({
        where: {
          id: polaroid_id,
          user_id,
        },
      });
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to update polaroid');
    }
  }

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

  async polaroidCounts(user_id: number): Promise<number> {
    const polaroid = await this.findAll(user_id);
    return polaroid.length;
  }

  async findByPublic(user_id: number): Promise<Polaroid[]> {
    const user = await this.userService.findOne(user_id);
    const polaroid = await this.polaroidRepository.find({
      where: { user_id, is_opened: true },
    });
    return polaroid;
  }

  async findLandmarkPolaroid(
    user_id: number,
    landmark_id: number,
  ): Promise<Polaroid[]> {
    try {
      const landmarkPolaroid = this.polaroidRepository.find({
        where: { user_id, landmark_id },
      });
      return landmarkPolaroid;
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to retrieve landmark polaroids',
      );
    }
  }

  async landmarkPolaroidCounts(
    user_id: number,
    landmark_id: number,
  ): Promise<number> {
    const landmarkPolaroids = await this.findLandmarkPolaroid(
      user_id,
      landmark_id,
    );
    return landmarkPolaroids.length;
  }
}
