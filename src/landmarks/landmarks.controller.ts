import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LandmarksService } from './landmarks.service';
import { LandmarkDto } from './dto/landmark.dto';

@Controller('landmarks')
export class LandmarksController {
  constructor(private readonly landmarksService: LandmarksService) {}

  // 디비에 랜드마크 추가
  @Post()
  async create(@Body() landmarkDto: LandmarkDto) {
    return this.landmarksService.create(landmarkDto);
  }

  @Get()
  async find() {
    return this.landmarksService.find();
  }

  @Get(':landmark_id')
  async findOne(@Param('landmark_id') landmark_id: number) {
    return this.landmarksService.findOne(landmark_id);
  }

  @Delete(':landmark_id')
  async remove(@Param('landmark_id') landmark_id: number) {
    return this.landmarksService.remove(landmark_id);
  }
}
