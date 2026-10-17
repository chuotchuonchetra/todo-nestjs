import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosService } from './todo.service.js';
import { TodosController } from './todo.controller.js';
import { Todo } from './entities/todo.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodoModule {}
