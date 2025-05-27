import { number } from 'joi';
import { Landmark } from 'src/landmarks/entities/landmark.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'bookmarks' })
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' })
  user: User;

  @Column({ name: 'user_id', nullable: false })
  user_id: number;

  @ManyToOne(() => Landmark, (landmark) => landmark.bookmarks, {
    onDelete: 'CASCADE',
  })
  landmark: Landmark;

  @Column({ name: 'landmark_id', nullable: false })
  landmark_id: number;
}
