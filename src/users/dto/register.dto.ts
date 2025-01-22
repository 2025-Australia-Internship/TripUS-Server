import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  profile_image: string;

  @IsString()
  @IsNotEmpty({ message: 'Please write your Nickname. 닉네임을 입력해주세요.' })
  username: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Please write your email. 이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'Please write your password. 비밀번호를 입력해주세요.',
  })
  password: string;
}
