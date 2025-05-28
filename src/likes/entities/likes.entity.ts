import { Landmark } from 'src/landmarks/entities/landmark.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'likes' })
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' })
  user: User;

  @Column('int', { name: 'user_id', nullable: false })
  user_id: number;

  @ManyToOne(() => Landmark, (landmark) => landmark.bookmarks, {
    onDelete: 'CASCADE',
  })
  landmark: Landmark;

  @Column('int', { name: 'landmark_id', nullable: false })
  landmark_id: number;

  @Column('boolean', { name: 'is_liked', default: true })
  is_liked: boolean;

  @CreateDateColumn({ name: 'create_at' })
  create_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
