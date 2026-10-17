import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../todo/entities/todo.entity.js';
import { UserModule } from '../user/user.module.js';
import { DemoController } from './demo.controller.js';
import { DemoService } from './demo.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), UserModule],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
