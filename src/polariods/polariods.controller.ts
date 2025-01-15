import { Controller } from '@nestjs/common';
import { PolariodsService } from './polariods.service';

@Controller('polariods')
export class PolariodsController {
  constructor(private readonly polariodsService: PolariodsService) {}
}
