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

  async create(landmarkDto: LandmarkDto): Promise<Landmark> {
    try {
      const landmark = await this.LandmarkRepository.create(landmarkDto);
      return await this.LandmarkRepository.save(landmark);
    } catch (e) {
      throw new InternalServerErrorException('Failed to create landmark');
    }
  }

  async find(): Promise<Landmark[] | null> {
    try {
      return await this.LandmarkRepository.find();
    } catch (e) {
      throw new InternalServerErrorException('Failed to retrieve landmark');
    }
  }

  async findOne(id: number): Promise<Landmark | null> {
    try {
      return await this.LandmarkRepository.findOneBy({ id });
    } catch (e) {
      throw new InternalServerErrorException('Failed to retrieve landmark');
    }
  }

  async remove(id: number) {
    try {
      const landmark = await this.LandmarkRepository.findOneBy({ id });
      if (!landmark) {
        throw new NotFoundException('Landmarks not found');
      }

      return await this.LandmarkRepository.delete(id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to create landmark');
    }
  }
}
