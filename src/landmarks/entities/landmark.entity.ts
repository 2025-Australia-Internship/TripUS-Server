import {
  Column,
  CreateDateColumn,
  Entity,
  Point,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'landmarks' })
export class Landmark {
  @PrimaryGeneratedColumn({ name: 'landmark_id' })
  landmark_id: number;

  @Column('varchar', { length: 100, nullable: false, name: 'name' })
  name: string;

  @Column('point', { nullable: false, name: 'coordinates' })
  coordinates: Point;

  @Column('text', { nullable: false, name: 'address' })
  address: string;

  @Column('varchar', { length: 255, nullable: false, name: 'image' })
  image: string;

  @Column('varchar', { length: 255, nullable: false, name: 'symbol' })
  symbol: string;

  @Column('text', { nullable: false, name: 'description' })
  description: string;

  @Column('number', { name: 'likes' })
  likes: number;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;
}
