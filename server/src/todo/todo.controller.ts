import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/jwt.strategy.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { BulkStatusDto, TodoIdsDto } from './dto/todo-ids.dto.js';
import { TodosService } from './todo.service.js';

@Controller('todos')
export class TodosController {
  constructor(private readonly todos: TodosService) {}
  @Get()
  findAll() {
    return this.todos.findAll();
  }
  @Post()
  create(@Body() dto: CreateTodoDto, @CurrentUser() user: AuthUser) {
    return this.todos.create(dto, user.id); // owner from the token; 201 by default
  }
  // static routes must stay above ':id'
  @Put('reorder')
  reorder(@Body() dto: TodoIdsDto) {
    return this.todos.reorder(dto.ids);
  }
  @Patch('bulk/status')
  bulkStatus(@Body() dto: BulkStatusDto) {
    return this.todos.bulkStatus(dto.ids, dto.status);
  }
  @Delete('bulk')
  bulkRemove(@Body() dto: TodoIdsDto) {
    return this.todos.bulkRemove(dto.ids);
  }
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.todos.findOne(id);
  }
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTodoDto) {
    return this.todos.update(id, dto);
  }
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.todos.remove(id);
  }
}
