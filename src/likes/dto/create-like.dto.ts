import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLikesDto {
  @IsNumber()
  @IsNotEmpty()
  landmark_id: number;
}
