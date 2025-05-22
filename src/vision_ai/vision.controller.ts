import { Body, Controller, Post } from '@nestjs/common';
import { VisionService } from './vision.serivce';

@Controller('api/vision-ai')
export class VisionController {
  constructor(private readonly visionService: VisionService) {}

  @Post()
  async analyze(@Body('image') image: string) {
    const landmarkId = await this.visionService.detectLandmarkFromImage(image);
    return landmarkId ? landmarkId : { message: 'No landmark detected' };
  }
}
