import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookmarkDto {
  @IsNumber()
  @IsNotEmpty()
  landmark_id: number;
}
