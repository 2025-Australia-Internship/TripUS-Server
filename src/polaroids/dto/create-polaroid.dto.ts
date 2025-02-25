import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePolaroidDto {
  @IsString()
  @IsNotEmpty({ message: '사진을 선택해주세요.' })
  photo_url: string;

  @IsString()
  caption: string;

  color: string;
}
