import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PolaroidsService } from './polaroids.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { UserInfo } from 'src/users/utils/userInfo.decorator';
import { PolaroidDto } from './dto/polaroid.dto';

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
}
