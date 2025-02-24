import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Please write your email.' })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'Please write your password.',
  })
  password: string;
}
