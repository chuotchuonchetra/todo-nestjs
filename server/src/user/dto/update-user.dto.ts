import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  displayName: string;
  @IsOptional()
  @IsString()
  title?: string;
  @IsOptional()
  @IsString()
  email?: string;
  @IsOptional()
  @IsString()
  avatarUrl?: string;
  @IsOptional()
  @IsString()
  bio?: string;
}
