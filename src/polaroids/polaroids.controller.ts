import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PolaroidsService } from './polaroids.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/users/utils/userInfo.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreatePolaroidDto } from './dto/create-polaroid.dto';
import { UpdatePolaroidDto } from './dto/update-polaroid.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/polaroids')
export class PolaroidsController {
  constructor(private readonly polaroidsService: PolaroidsService) {}

  @Post()
  async create(
    @UserInfo() user: User,
    @Body() createPolaroidDto: CreatePolaroidDto,
  ) {
    return this.polaroidsService.create(user, createPolaroidDto);
  }

  @Get()
  async findAll(@UserInfo('id') id: number) {
    return this.polaroidsService.findAll(id);
  }

  @Get('counts')
  async counts(@UserInfo('id') id: number) {
    return this.polaroidsService.polaroidCounts(id);
  }

  @Get(':polaroid_id')
  async findOne(
    @UserInfo('id') id: number,
    @Param('polaroid_id') polaroid_id: number,
  ) {
    return this.polaroidsService.findOne(id, polaroid_id);
  }

  @Patch(':polaroid_id')
  async update(
    @UserInfo('id') id: number,
    @Param('polaroid_id') polaroid_id: number,
    @Body() updatePolaroidDto: UpdatePolaroidDto,
  ) {
    return this.polaroidsService.update(id, polaroid_id, updatePolaroidDto);
  }

  @Delete(':polaroid_id')
  async delete(
    @UserInfo('id') id: number,
    @Param('polaroid_id') polaroid_id: number,
  ) {
    return this.polaroidsService.delete(id, polaroid_id);
  }

  @Get(':user_id/public')
  async findByPublic(@Param('user_id') user_id: number) {
    return this.polaroidsService.findByPublic(user_id);
  }

  @Get('landmark/:landmark_id')
  async findLandmarkdPolaroid(
    @UserInfo('id') id: number,
    @Param('landmark_id') landmark_id: number,
  ) {
    return this.polaroidsService.findLandmarkPolaroid(id, landmark_id);
  }

  @Get('landmark_counts/:landmark_id')
  async landmarkPolaroidCounts(
    @UserInfo('id') id: number,
    @Param('landmark_id') landmark_id: number,
  ) {
    return this.polaroidsService.landmarkPolaroidCounts(id, landmark_id);
  }
}
