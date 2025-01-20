import { Module } from '@nestjs/common';
import { UsersController, UsersInfoController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Landmark } from 'src/landmarks/entities/landmark.entity';
import { Visit } from 'src/visits/entities/visit.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Landmark, Visit]),
    // JwtModule.register({}),
  ],

  controllers: [UsersController, UsersInfoController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
