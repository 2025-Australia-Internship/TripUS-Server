import { Injectable } from '@nestjs/common';
import { Polaroid } from './entities/polaroid.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PolaroidDto } from './dto/polaroid.dto';
import { User } from 'src/users/entities/user.entity';

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

  findAll(user: User): Promise<Polaroid[]> {
    return this.polaroidRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} Polaroid`;
  }

  // update(id: number, updatePolaroidDto: UpdatePolaroidDto) {
  //   return `This action updates a #${id} Polaroid`;
  // }

  remove(id: number) {
    return `This action removes a #${id} Polaroid`;
  }
}
