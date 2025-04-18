import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Polaroid } from 'src/polaroids/entities/polaroid.entity';
import { Visit } from 'src/visits/entities/visit.entity';
import { Landmark } from 'src/landmarks/entities/landmark.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('varchar', {
    length: 50,
    nullable: false,
    unique: true,
    name: 'username',
  })
  username?: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
    unique: true,
    name: 'email',
  })
  email: string;

  @Column('varchar', { length: 255, nullable: false, name: 'password' })
  password: string;

  @Column('longtext', { nullable: true, name: 'profile_image' })
  profile_image: string;

  @OneToOne(() => Landmark, { nullable: true })
  @JoinColumn({
    name: 'background_url',
    referencedColumnName: 'background_image',
  })
  background_url: string;

  @Column('varchar', { length: 100, nullable: true, name: 'status' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;

  @OneToMany(() => Polaroid, (polaroid) => polaroid.user)
  polaroids: Polaroid[];

  @OneToMany(() => Visit, (visit) => visit.user)
  visits: Visit[];

  @BeforeInsert()
  private beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
