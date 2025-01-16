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

  @Column('varchar', { name: 'photo_url', nullable: false })
  photo_url: string;

  @Column('text', { name: 'caption' })
  caption: string;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;

  @ManyToOne(() => User, (user) => user.polaroids)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
