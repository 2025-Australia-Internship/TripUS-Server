import { Landmark } from 'src/landmarks/entities/landmark.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'polaroids' })
export class Polaroid {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('longtext', { name: 'photo_url', nullable: false })
  photo_url: string;

  @Column('varchar', { length: 255, name: 'color' })
  color: string;

  @Column('text', { name: 'caption' })
  caption: string;

  @Column('boolean', { name: 'is_opened', default: false })
  is_opened: boolean;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;

  // 객체 관계
  @ManyToOne(() => User, (user) => user.polaroids, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // id 값
  @Column()
  user_id: number;

  @ManyToOne(() => Landmark, (landmark) => landmark.polaroids, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'landmark_id' })
  landmark?: Landmark;

  @Column({ nullable: true })
  landmark_id?: number;
}
