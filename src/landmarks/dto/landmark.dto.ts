import { IsNotEmpty, IsString } from 'class-validator';
import { Point } from 'typeorm';

export class CreateLandmarkDto {
  @IsString()
  @IsNotEmpty({ message: '랜드마크의 이름을 입력하세요' })
  name: string;

  @IsNotEmpty({ message: 'Point를 적어주세요' })
  coordinates: Point;

  @IsNotEmpty({ message: '주소를 적어주세요' })
  address: string;

  @IsNotEmpty({ message: '이미지를 등록해주세요' })
  image: string;

  @IsNotEmpty({ message: '심볼을 등록해주세요' })
  symbol: string;

  @IsNotEmpty({ message: '설명을 적어주세요' })
  description: string;
}
