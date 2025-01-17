import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { Repository } from 'typeorm';
import { Landmark } from 'src/landmarks/entities/landmark.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private visitRepository: Repository<Visit>,
  ) {}

  create(user: User, Landmark: Landmark): Promise<Visit> {
    try {
      const visit = this.visitRepository.create({
        user: user,
        landmark: Landmark,
      });
      return this.visitRepository.save(visit);
    } catch (error) {
      console.error('Error can not create: ', error);
    }
  }
}
