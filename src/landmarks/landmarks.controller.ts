import { Controller } from '@nestjs/common';
import { LandmarksService } from './landmarks.service';

@Controller('landmarks')
export class LandmarksController {
  constructor(private readonly landmarksService: LandmarksService) {}
}
