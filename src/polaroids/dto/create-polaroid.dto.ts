import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePolaroidDto {
  @IsString()
  @IsNotEmpty()
  photo_url: string;

  @IsString()
  @IsNotEmpty()
  caption: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @IsOptional()
  landmark_id?: number;
}
