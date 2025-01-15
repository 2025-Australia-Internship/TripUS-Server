import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Polaroid } from 'src/polaroids/entities/polaroid.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  user_id: number;

  @Column('varchar', {
    length: 50,
    nullable: false,
    unique: true,
    name: 'username',
  })
  username: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
    unique: true,
    name: 'email',
  })
  email: string;

  @Column('varchar', { length: 255, nullable: false, name: 'password' })
  password: string;

  @Column('varchar', { length: 255, nullable: true, name: 'profile_image' })
  profile_image: string;

  @Column('varchar', { length: 100, nullable: true, name: 'status' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;

  @OneToMany(() => Polaroid, (polaroid) => polaroid.user_id)
  polaroids: Polaroid[];

  @BeforeInsert()
  private beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
