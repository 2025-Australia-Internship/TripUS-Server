import { Injectable } from '@nestjs/common';
import { PolaroidDto } from './dto/polaroid.dto';

@Injectable()
export class PolaroidsService {
  create(createPolaroidDto: PolaroidDto) {
    return 'This action adds a new Polaroid';
  }

  findAll() {
    return `This action returns all Polaroids`;
  }

  findOne(id: number) {
    return `This action returns a #${id} Polaroid`;
  }

  update(id: number, updatePolaroidDto: PolaroidDto) {
    return `This action updates a #${id} Polaroid`;
  }

  remove(id: number) {
    return `This action removes a #${id} Polaroid`;
  }
}
