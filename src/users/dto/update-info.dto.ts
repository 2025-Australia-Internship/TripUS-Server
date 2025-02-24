import { IsOptional, IsString } from 'class-validator';

export class UpdateInfoDto {
  @IsOptional()
  @IsString()
  profile_image: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  status: string;
}
