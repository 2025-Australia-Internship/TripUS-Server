import { Injectable } from '@nestjs/common';
import { CreatePolariodDto } from './dto/polariod.dto';
import { UpdatePolariodDto } from './dto/update-polariod.dto';

@Injectable()
export class PolariodsService {
  create(createPolariodDto: CreatePolariodDto) {
    return 'This action adds a new polariod';
  }

  findAll() {
    return `This action returns all polariods`;
  }

  findOne(id: number) {
    return `This action returns a #${id} polariod`;
  }

  update(id: number, updatePolariodDto: UpdatePolariodDto) {
    return `This action updates a #${id} polariod`;
  }

  remove(id: number) {
    return `This action removes a #${id} polariod`;
  }
}
