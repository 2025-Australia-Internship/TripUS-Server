import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Landmark } from './entities/landmark.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LandmarkDto } from './dto/landmark.dto';

@Injectable()
export class LandmarksService {
  constructor(
    @InjectRepository(Landmark)
    private LandmarkRepository: Repository<Landmark>,
  ) {}

  async create(landmarkDto: LandmarkDto) {
    try {
      const landmark = await this.LandmarkRepository.create(landmarkDto);
      await this.LandmarkRepository.save(landmark);

      return {
        status: HttpStatus.CREATED,
        message: 'Landmark created successfully',
        data: landmark,
      };
    } catch (e) {
      throw new InternalServerErrorException('Failed to create landmark');
    }
  }

  async find() {
    try {
      const landmarks = await this.LandmarkRepository.find();

      if (!landmarks) {
        throw new NotFoundException('Landmarks not found');
      }

      return {
        status: HttpStatus.OK,
        message: 'Landmark retrieved successfully',
        data: landmarks,
      };
    } catch (e) {
      if (e instanceof NotFoundException)
        throw new InternalServerErrorException('Failed to retrieve landmark');
    }
  }

  async findOne(id: number) {
    try {
      const landmark = await this.LandmarkRepository.findOneBy({ id });

      if (!landmark) {
        throw new NotFoundException('Landmarks not found');
      }

      return {
        status: HttpStatus.OK,
        message: 'Landmark retrieved successfully',
        data: landmark,
      };
    } catch (e) {
      if (e instanceof NotFoundException)
        throw new InternalServerErrorException('Failed to retrieve landmark');
    }
  }

  async remove(id: number) {
    try {
      const landmark = await this.LandmarkRepository.findOneBy({ id });

      if (!landmark) {
        throw new NotFoundException('Landmarks not found');
      }

      await this.LandmarkRepository.delete(id);

      return {
        status: HttpStatus.CREATED,
        message: 'Landmark created successfully',
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to create landmark');
    }
  }
}
