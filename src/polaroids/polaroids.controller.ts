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
import { User } from 'src/users/entities/user.entity';
import { UserInfo } from 'src/users/utils/userInfo.decorator';
import { PolaroidDto } from './dto/polaroid.dto';
import { number } from 'joi';

@Controller('polaroids')
export class PolaroidsController {
  constructor(private readonly polaroidsService: PolaroidsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@UserInfo() user: User, @Body() polaroidDto: PolaroidDto) {
    return this.polaroidsService.create(user, polaroidDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@UserInfo() user: User) {
    return this.polaroidsService.findAll(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@UserInfo() user: User, @Param('id') id: number) {
    return this.polaroidsService.findOne(user, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @UserInfo() user: User,
    @Param('id') id: number,
    @Body() polaroidDto: PolaroidDto,
  ) {
    return this.polaroidsService.update(user, id, polaroidDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@UserInfo() user: User, @Param('id') id: number) {
    return this.polaroidsService.delete(user, id);
  }
}
