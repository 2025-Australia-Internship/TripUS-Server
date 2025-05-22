import { Module } from '@nestjs/common';
import { VisionService } from './vision.serivce';
import { VisionController } from './vision.controller';
import { LandmarksModule } from 'src/landmarks/landmarks.module';

@Module({
  imports: [LandmarksModule],
  controllers: [VisionController],
  providers: [VisionService],
})
export class VisionModule {}
