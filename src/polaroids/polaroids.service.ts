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
import { PolaroidDto } from './dto/polaroid.dto';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class PolaroidsService {
  constructor(
    @InjectRepository(Polaroid)
    private polaroidRepository: Repository<Polaroid>,
  ) {}

  async create(id: number, polaroidDto: PolaroidDto) {
    try {
      const polaroid = {
        ...polaroidDto,
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

  async update(id: number, polaroid_id: number, polaroidDto: PolaroidDto) {
    try {
      const polaroid = await this.polaroidRepository.findOne({
        where: { id: polaroid_id, user: { id } },
      });

      if (!polaroid) {
        throw new NotFoundException('Polaroid not found');
      }

      await this.polaroidRepository.update(polaroid_id, polaroidDto);
      const updatedPolaroid = await this.polaroidRepository.findOne({
        where: {
          id: polaroid_id,
          user: { id },
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Polaroid updated successfully',
        data: updatedPolaroid,
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to update polaroid');
    }
  }

  async delete(id: number, polaroid_id: number) {
    try {
      const polaroid = await this.polaroidRepository.findOne({
        where: { id: polaroid_id, user: { id } },
        relations: ['user'],
      });

      if (!polaroid) {
        throw new NotFoundException('Polaroid not found');
      }

      await this.polaroidRepository.remove(polaroid);

      return {
        status: HttpStatus.OK,
        message: 'Polaroid deleted successfully',
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to delete polaroid');
    }
  }
}
