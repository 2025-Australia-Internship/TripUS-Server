import { Module } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Visit]),
    // JwtModule.register({}),
  ],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}
