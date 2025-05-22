import { IsOptional, IsString } from 'class-validator';

export class PolaroidDto {
  @IsString()
  @IsOptional()
  photo_url: string;

  @IsString()
  caption: string;

  color: string;
}
