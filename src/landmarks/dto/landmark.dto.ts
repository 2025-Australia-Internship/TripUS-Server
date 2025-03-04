import { IsNotEmpty, IsString } from 'class-validator';

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
  background_image: string;

  @IsNotEmpty()
  symbol: string;

  @IsNotEmpty()
  description: string;
}
