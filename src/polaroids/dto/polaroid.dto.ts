import { IsNotEmpty, IsString } from 'class-validator';

export class PolaroidDto {
  @IsString()
  @IsNotEmpty()
  photo_url: string;

  @IsString()
  caption: string;

  color: string;
}
