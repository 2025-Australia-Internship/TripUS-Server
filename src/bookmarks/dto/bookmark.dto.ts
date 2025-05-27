import { IsNotEmpty, IsNumber } from 'class-validator';

export class BookmarkDto {
  @IsNumber()
  @IsNotEmpty()
  landmark_id: number;
}
