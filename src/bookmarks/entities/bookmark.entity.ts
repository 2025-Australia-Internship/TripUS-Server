import { Landmark } from 'src/landmarks/entities/landmark.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'bookmarks' })
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Landmark, (landmark) => landmark.bookmarks, {
    onDelete: 'CASCADE',
  })
  landmark: Landmark;
}
