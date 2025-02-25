import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Landmark } from 'src/landmarks/entities/landmark.entity';
import { Visit } from 'src/visits/entities/visit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Landmark, Visit]),
    // JwtModule.register({}),
  ],

  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
