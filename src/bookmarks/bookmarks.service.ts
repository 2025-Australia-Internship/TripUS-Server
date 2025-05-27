import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { LandmarksService } from 'src/landmarks/landmarks.service';
import { BookmarkDto } from './dto/bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    private landmarkService: LandmarksService,
  ) {}

  async create(user: User, bookmarkDto: BookmarkDto): Promise<Bookmark | null> {
    try {
      const landmark_id = bookmarkDto.landmark_id;
      const landmark = await this.landmarkService.findOne(landmark_id);
      if (!landmark) {
        throw new NotFoundException('Landmark not found');
      }

      const exsitingBookmark = this.bookmarkRepository.find({
        where: { user_id: user.id, landmark_id },
      });
      if (exsitingBookmark) {
        throw new ConflictException('Bookmark already exists');
      }

      const bookmark = {
        user,
        user_id: user.id,
        landmark,
        landmark_id,
      };
      return await this.bookmarkRepository.save(bookmark);
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to create bookmark');
    }
  }

  async find(id: number): Promise<Bookmark[] | null> {
    return await this.bookmarkRepository.find({ where: { user: { id } } });
  }
}
