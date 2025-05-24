import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePolaroidDto {
  @IsString()
  @IsNotEmpty()
  caption?: string;

  @IsString()
  @IsNotEmpty()
  color?: string;

  @IsBoolean()
  @IsOptional()
  is_open?: boolean;
}
