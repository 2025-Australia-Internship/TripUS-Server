import { Controller } from '@nestjs/common';
import { PolaroidsService } from './polaroids.service';

@Controller('polaroids')
export class PolaroidsController {
  constructor(private readonly polaroidsService: PolaroidsService) {}
}
