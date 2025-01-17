import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Landmark } from 'src/landmarks/entities/landmark.entity';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private visitRepository: Repository<Visit>,

    @InjectRepository(Landmark)
    private landmarkRepository: Repository<Landmark>,
  ) {}

  async create(user: User, landmark_id: number): Promise<Visit> {
    try {
      const landmark = await this.landmarkRepository.findOne({
        where: { id: landmark_id },
      });
      if (!landmark) {
        throw new Error('Landmark not found');
      }

      const visit = this.visitRepository.create({
        user: user,
        landmark: landmark,
      });
      return await this.visitRepository.save(visit);
    } catch (error) {
      console.error('Error can not create: ', error);
      throw error;
    }
  }

  async findAll(user: User): Promise<Visit[]> {
    try {
      const visit = this.visitRepository.find({
        where: { user: { id: user.id } },
        relations: ['landmark'],
      });
      return visit;
    } catch (error) {
      console.error('Error can not find: ', error);
    }
  }
}
