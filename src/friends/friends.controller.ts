import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Controller('friends')
export class FriendsController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
}
