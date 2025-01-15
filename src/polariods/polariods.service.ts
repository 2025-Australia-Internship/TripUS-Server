import { Injectable } from '@nestjs/common';
import { PolariodDto } from './dto/polariod.dto';

@Injectable()
export class PolariodsService {
  create(createPolariodDto: PolariodDto) {
    return 'This action adds a new polariod';
  }

  findAll() {
    return `This action returns all polariods`;
  }

  findOne(id: number) {
    return `This action returns a #${id} polariod`;
  }

  update(id: number, updatePolariodDto: PolariodDto) {
    return `This action updates a #${id} polariod`;
  }

  remove(id: number) {
    return `This action removes a #${id} polariod`;
  }
}
