import { IsNotEmpty, IsString } from 'class-validator';
import { Point } from 'typeorm';

export class LandmarkDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  coordinates: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  symbol: string;

  @IsNotEmpty()
  description: string;
}
