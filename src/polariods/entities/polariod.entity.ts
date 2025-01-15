import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'polariods' })
export class Polariod {
  @PrimaryGeneratedColumn({ name: 'polariod_id' })
  polraiod_id: number;

  @Column('varchar', { name: 'photo_url', nullable: false })
  photo_url: string;

  @Column('text', { name: 'caption' })
  caption: string;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;

  @ManyToOne(() => User, (user) => user.polariods)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user_id: User;
}