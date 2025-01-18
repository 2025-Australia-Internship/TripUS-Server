import { IsString } from 'class-validator';

export class UpdateInfoDto {
  @IsString()
  profile_image: string;

  @IsString()
  username: string;

  @IsString()
  status: string;
}
