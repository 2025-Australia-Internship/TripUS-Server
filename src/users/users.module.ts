import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Landmark } from 'src/landmarks/entities/landmark.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Landmark]),
    // JwtModule.register({}),
  ],

  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
