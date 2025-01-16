import { Injectable } from '@nestjs/common';
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
    const landmark = this.LandmarkRepository.create(landmarkDto);
    return this.LandmarkRepository.save(landmark);
  }

  // 모든 랜드마크 조회
  async find(): Promise<Landmark[]> {
    return this.LandmarkRepository.find();
  }

  async findOne(id: number): Promise<Landmark> {
    return this.LandmarkRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.LandmarkRepository.delete({ id });
  }
}
