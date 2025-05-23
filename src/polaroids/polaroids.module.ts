import { Module } from '@nestjs/common';
import { PolaroidsService } from './polaroids.service';
import { PolaroidsController } from './polaroids.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Polaroid } from './entities/polaroid.entity';
import { LandmarksModule } from 'src/landmarks/landmarks.module';

@Module({
  imports: [
    LandmarksModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Polaroid]),
    // JwtModule.register({}),
  ],
  controllers: [PolaroidsController],
  providers: [PolaroidsService],
  exports: [PolaroidsService],
})
export class PolaroidsModule {}
