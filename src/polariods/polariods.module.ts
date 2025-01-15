import { Module } from '@nestjs/common';
import { PolariodsService } from './polariods.service';
import { PolariodsController } from './polariods.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Polariod } from './entities/polariod.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Polariod]),
    // JwtModule.register({}),
  ],
  controllers: [PolariodsController],
  providers: [PolariodsService],
  exports: [PolariodsService],
})
export class PolariodsModule {}
