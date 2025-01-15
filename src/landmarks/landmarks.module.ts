import { Module } from '@nestjs/common';
import { LandmarksService } from './landmarks.service';
import { LandmarksController } from './landmarks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Landmark } from './entities/landmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Landmark])],
  controllers: [LandmarksController],
  providers: [LandmarksService],
  exports: [LandmarksService],
})
export class LandmarksModule {}
