import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePolaroidDto {
  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  is_open?: boolean;
}
