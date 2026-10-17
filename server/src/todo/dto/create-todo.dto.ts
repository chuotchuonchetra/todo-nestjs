import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  TODO_CATEGORIES,
  TODO_PRIORITIES,
  TODO_STATUSES,
} from '../todo.constants.js';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsIn(TODO_STATUSES)
  status?: string;
  @IsOptional()
  @IsIn(TODO_PRIORITIES)
  priority?: string;
  @IsOptional()
  @IsIn(TODO_CATEGORIES)
  category?: string;
  @IsOptional()
  @IsBoolean()
  starred?: boolean;
}
