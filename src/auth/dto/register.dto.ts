import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  profile_image: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
