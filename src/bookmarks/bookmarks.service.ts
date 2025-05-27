import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { LandmarksService } from 'src/landmarks/landmarks.service';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    private landmarkService: LandmarksService,
  ) {}

  async create(user: User, landmark_id: number): Promise<Bookmark | null> {
    try {
      const landmark = await this.landmarkService.findOne(landmark_id);
      if (!landmark) {
        throw new NotFoundException('Landmark not found');
      }

      const bookmark = {
        user,
        landmark,
      };
      return await this.bookmarkRepository.save(bookmark);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to create bookmark');
    }
  }
}
