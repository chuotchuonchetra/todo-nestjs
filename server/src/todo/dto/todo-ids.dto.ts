import { ArrayNotEmpty, IsArray, IsIn, IsUUID } from 'class-validator';
import { TODO_STATUSES } from '../todo.constants.js';

export class TodoIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  ids: string[];
}

export class BulkStatusDto extends TodoIdsDto {
  @IsIn(TODO_STATUSES)
  status: string;
}
