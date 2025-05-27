import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Bookmark } from './entities/bookmark.entity';
import { BookmarkController } from './bookmarks.controller';
import { BookmarkService } from './bookmarks.service';
import { LandmarksModule } from 'src/landmarks/landmarks.module';

@Module({
  imports: [
    LandmarksModule,
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Bookmark]),
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
