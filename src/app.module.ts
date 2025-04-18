import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './ormconfig';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './auth/jwt.strategy';
import { LandmarksModule } from './landmarks/landmarks.module';
import { PolaroidsModule } from './polaroids/polaroids.module';
import { VisitsModule } from './visits/visits.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    LandmarksModule,
    PolaroidsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    VisitsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtStrategy }],
})
export class AppModule {}
