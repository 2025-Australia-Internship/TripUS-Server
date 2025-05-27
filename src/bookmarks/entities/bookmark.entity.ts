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

@Entity({ name: 'bookmarks' })
export class Bookmark {
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

  @Column('boolean', { name: 'is_marked', default: true })
  is_marked: boolean;

  @CreateDateColumn({ name: 'create_at' })
  create_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
