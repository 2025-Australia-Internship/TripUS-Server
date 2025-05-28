import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { LandmarksService } from 'src/landmarks/landmarks.service';
import { CreateLikesDto } from './dto/create-like.dto';
import { Likes } from './entities/likes.entity';
import { LikeStatusResponseDto } from './dto/like-status-response.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private likesRepository: Repository<Likes>,
    private readonly landmarkService: LandmarksService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    user: User,
    createLikesDto: CreateLikesDto,
  ): Promise<Likes | null> {
    const landmark_id = createLikesDto.landmark_id;
    const landmark = await this.landmarkService.findOne(landmark_id);
    if (!landmark) {
      throw new NotFoundException('Landmark not found');
    }

    // 트랜잭션
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingLike = await queryRunner.manager.findOne(Likes, {
        where: { user_id: user.id, landmark_id },
      });
      if (existingLike) {
        throw new ConflictException('Likes already exists');
      }

      const like = await queryRunner.manager.create(Likes, {
        user,
        user_id: user.id,
        landmark,
        landmark_id,
      });
      await this.landmarkService.incrementLikes(landmark_id, queryRunner);
      const savedLike = await queryRunner.manager.save(Likes, like);

      await queryRunner.commitTransaction();
      return savedLike;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to create likes');
    } finally {
      await queryRunner.release();
    }
  }

  async find(user_id: number): Promise<Likes[]> {
    return await this.likesRepository.find({ where: { user_id } });
  }

  async findOne(
    user_id: number,
    landmark_id: number,
  ): Promise<LikeStatusResponseDto> {
    const bookmark = await this.likesRepository.findOne({
      where: { user_id, landmark_id },
    });
    if (!bookmark) {
      throw new NotFoundException('Like not found');
    }

    return { is_liked: bookmark.is_liked };
  }
}
