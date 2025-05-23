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

  @Get(':polaroid_id')
  async findOne(
    @UserInfo('id') id: number,
    @Param('polaroid_id') polaroid_id: number,
  ) {
    return this.polaroidsService.findOne(id, polaroid_id);
  }

  // @Patch(':polaroid_id')
  // async update(
  //   @UserInfo('id') id: number,
  //   @Param('polaroid_id') polaroid_id: number,
  //   @Body() polaroidDto: PolaroidDto,
  // ) {
  //   return this.polaroidsService.update(id, polaroid_id, polaroidDto);
  // }

  @Delete(':polaroid_id')
  async delete(
    @UserInfo('id') id: number,
    @Param('polaroid_id') polaroid_id: number,
  ) {
    return this.polaroidsService.delete(id, polaroid_id);
  }
}
